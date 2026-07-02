// src/app.js
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

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
import { getEmbedder } from "./intents/embedder.js";

import orderApi from "./api/orderApi.js";

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);

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
app.post("/webhook/support-update", (req, res) => {
  const { event, ticketId, agent } = req.body;

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

// --- Main virtual agent endpoint ---
app.post("/agent", async (req, res) => {
  const userMessage = req.body.message;

  logger.info(`User said: ${userMessage}`);

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
          source: "rule"
        })
      );
    }

    let response;

    switch (intent) {
      case "faq":
        const faqResponse = await faqFlow(userMessage);
        if (faqResponse.intent === "faq_no_match") {
          return res.json(
            await fallbackFlow(userMessage, confidence, faqResponse.matches)
          );
        }
        return res.json(faqResponse);

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

export default app;
