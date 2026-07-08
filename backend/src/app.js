// src/app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "crypto";


import logger from "./utils/logger.js";
import requestLogger from "./middleware/requestLogger.js";

import classifyIntent from "./intents/intentClassifier.js";
import faqFlow from "./flows/faqFlow.js";
import orderFlow from "./flows/orderFlow.js";
import escalationFlow from "./flows/escalationFlow.js";
import fallbackFlow from "./flows/fallbackFlow.js";
import smalltalkFlow from "./flows/smalltalkFlow.js";
import cancelEscalationFlow from "./flows/cancelEscalationFlow.js";
import helpFlow from "./flows/helpFlow.js";
import faqListFlow from "./flows/faqListFlow.js";
import productFlow from "./flows/productFlow.js";
import listProductsFlow from "./flows/listProductsFlow.js";
import supportRequestFlow from "./flows/supportRequestFlow.js";

import { addEvent, getEvents, clearEvents } from "./store/eventStore.js";
import { buildResponse } from "./utils/responseBuilder.js";

import orderApi from "./api/orderApi.js";
import { loadSecrets } from "./config/secrets.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { agentMessageSchema, webhookSchema } from "./validation/schemas.js";
import { sanitizeInput } from "./middleware/sanitize.js";
import { safeLogInput } from "./utils/logSanitizer.js";

const app = express();

// CORS origin: set CORS_ALLOWED_ORIGIN in Lambda env for production
const allowedOrigin =
  process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000";

// Rate limiting (soft limit; API Gateway will enforce hard limit)
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

const eventsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const routingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const ordersLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});


// --- Secrets loading (AWS Secrets Manager) ---
const isCI = process.env.CI === "true";
const isTest = process.env.NODE_ENV === "test";

let webhookSecret;
let secretsReady;

if (isTest || isCI) {
  webhookSecret = "test-secret";
  secretsReady = Promise.resolve();
} else {
  secretsReady = loadSecrets().then((secrets) => {
    webhookSecret = secrets.WEBHOOK_SECRET;
  });
}


// --- Middleware ---
app.disable("x-powered-by");
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      connectSrc: [
        "'self'",
        allowedOrigin, // your frontend domain
        "https://your-api-id.execute-api.region.amazonaws.com" // API Gateway
      ],
      imgSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  })
);

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-webhook-secret"]
  })
);

app.use(bodyParser.json({
  limit: "100kb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString("utf8");
  }
}));

app.use("/agent", messageLimiter);
app.use("/webhook", messageLimiter);
app.use("/events", eventsLimiter);
if (process.env.NODE_ENV !== "production") {
  app.use("/routing", routingLimiter);
}

app.use("/api/orders", ordersLimiter);

// Suppress noisy polling logs from /events
app.use((req, res, next) => {
  if (req.path !== "/events") {
    logger.info(`Incoming request: ${req.method} ${req.path}`);
  }
  next();
});

app.use(requestLogger);

// --- Dev-only routing UI (not exposed in production) ---
if (!isTest && process.env.NODE_ENV !== "production") {
  app.use("/routing-ui", express.static("./src/routing"));
}

// --- Health check endpoint ---
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Virtual agent running" });
});

// --- Mock API route ---
app.get("/api/orders/:id", orderApi);

// --- Events endpoint ---
app.get("/events", (req, res) => {
  const events = getEvents();

  if (events.length > 0) {
    res.json({ events, done: true });
    clearEvents();
    return;
  }

  res.json({ events: [], done: false });
});

// --- Webhook endpoint ---
app.post("/webhook/support-update", async (req, res) => {
  await secretsReady;

  // 1. Secret header check
  if (webhookSecret && req.get("x-webhook-secret") !== webhookSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // 2. HMAC signature check
  const signature = req.get("x-signature");
  if (!signature) {
    return res.status(401).json({ error: "Missing signature" });
  }

  const computed = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.rawBody)
    .digest("hex");

  if (computed !== signature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 3. Timestamp replay protection
  const timestamp = req.get("x-timestamp");
  if (!timestamp) {
    return res.status(401).json({ error: "Missing timestamp" });
  }

  const ts = Number(timestamp);
  const now = Date.now();

  // Reject requests older than 5 minutes
  if (Math.abs(now - ts) > 5 * 60 * 1000) {
    return res.status(401).json({ error: "Request expired" });
  }

  // 4. Validate payload with Zod
  const parsed = webhookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { event, ticketId, agent } = parsed.data;

  logger.info(`Webhook received: ${event} for ${ticketId} (agent: ${agent})`);

  addEvent({
    event,
    ticketId,
    agent,
    sender: "agent",
    text: `Your support ticket ${ticketId} has been assigned to ${agent}.`
  });

  res.status(200).json({ status: "ok" });
});


// --- Routing config endpoint (internal JSON) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  app.get("/routing", async (req, res) => {
    try {
      const filePath = path.join(__dirname, "routing", "routing.json");
      const raw = await fs.promises.readFile(filePath, "utf8");
      const routing = JSON.parse(raw);
      res.json(routing);
    } catch (err) {
      logger.error("Failed to load routing.json", err);
      res.status(500).json({ error: "Could not load routing.json" });
    }
  });
}


// --- Main virtual agent endpoint ---
app.post("/agent", async (req, res) => {
  // Validate input
  const parsed = agentMessageSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  // Sanitize
  const userMessage = sanitizeInput(parsed.data.message);

  logger.info(`User said: ${safeLogInput(userMessage)}`);

  const { intent, confidence } = await classifyIntent(userMessage);
  logger.info(`Detected intent: ${intent} (confidence: ${confidence})`);

  try {
    if (confidence === 0) {
      return res.json(await fallbackFlow(userMessage, confidence));
    }

    if (confidence === 1) {
      return res.json(
        buildResponse({
          text: "Just to make sure I’m helping with the right thing — is this about an order, a refund, or something else?",
          intent: "fallback_clarify",
          source: "rule",
        })
      );
    }

    let response;

    switch (intent) {
      case "faq": {
        const faqResponse = await faqFlow(userMessage);
        if (faqResponse.intent === "faq_no_match") {
          return res.json(
            await fallbackFlow(userMessage, confidence, faqResponse.matches)
          );
        }
        return res.json(faqResponse);
      }

      case "order_status":
        return res.json(await orderFlow(userMessage));

      case "escalate":
        return res.json(await escalationFlow());

      case "smalltalk":
        return res.json(await smalltalkFlow(userMessage));

      case "cancel_escalation":
        return res.json(await cancelEscalationFlow());

      case "help":
        return res.json(await helpFlow());

      case "faq_list":
        return res.json(await faqListFlow());

      case "product_lookup":
        return res.json(await productFlow(userMessage));

      case "list_products":
        return res.json(await listProductsFlow());

      case "support_request":
        return res.json(await supportRequestFlow());

      default:
        return res.json(await fallbackFlow(userMessage, confidence, []));
    }

    return res.json(response);
  } catch (err) {
    logger.error("Error in flow:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack
  });

  res.status(500).json({ error: "Internal server error" });
});


export default app;
