// src/server.js
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
import { buildResponse } from "./utils/responseBuilder.js";

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

// --- Main virtual agent endpoint ---
app.post("/agent", async (req, res) => {
  const userMessage = req.body.message;

  logger.info(`User said: ${userMessage}`);

  const { intent, confidence } = await classifyIntent(userMessage);
  logger.info(`Detected intent: ${intent} (confidence: ${confidence})`);

  try {
    // --- Confidence-based routing ---
    if (confidence === 0) {
      logger.info("Routing: confidence 0 → safe fallback");
      return res.json(await fallbackFlow(userMessage, confidence));
    }

    if (confidence === 1) {
      logger.info("Routing: confidence 1 → clarification prompt");
      return res.json(
        buildResponse({
          text: "Just to make sure I’m helping with the right thing — is this about an order, a refund, or something else?",
          intent: "fallback_clarify",
          source: "rule"
        })
      );
    }

    if (confidence === 2 || confidence === 3) {
      logger.info("Routing: confidence 2–3 → LLM fallback");
      return res.json(await fallbackFlow(userMessage, confidence));
    }

    // --- High-confidence routing ---
    logger.info("Routing: high confidence → intent flow");
    let response;

    switch (intent) {
      case "faq": {
        const faqResponse = await faqFlow(userMessage);

        if (faqResponse.intent === "faq_no_match") {
          logger.info("FAQ flow: no match → fallback to LLM");

          // Extract grounding data (empty array if none)
          const faqMatches = faqResponse.matches || [];

          response = await fallbackFlow(userMessage, confidence, faqMatches);
        } else {
          // FAQ matched → return FAQ answer directly
          logger.info("FAQ flow: match → returning FAQ answer");
          response = faqResponse;
        }
        break;
      }


      case "order_status":
        response = await orderFlow(userMessage);
        break;

      case "escalate":
        response = await escalationFlow();
        break;

      case "smalltalk":
        response = await smalltalkFlow(userMessage);
        break;

      default:
        logger.info("Routing: default → fallback");
        response = await fallbackFlow(userMessage, confidence);
        break;
    }

    return res.json(response);

  } catch (err) {
    logger.error("Error in flow:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Virtual agent server running on port ${PORT}`);
});
