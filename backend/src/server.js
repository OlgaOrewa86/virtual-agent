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
import cancelEscalationFlow from "./flows/cancelEscalationFlow.js";
import helpFlow from "./flows/helpFlow.js";
import faqListFlow from "./flows/faqListFlow.js";


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

    // For confidence 2–5 → route to intent flow
    logger.info("Routing: intent-based flow");
    let response;

    switch (intent) {
      case "faq": {
        const faqResponse = await faqFlow(userMessage);

        if (faqResponse.intent === "faq_no_match") {
          logger.info("FAQ flow: no match → safe fallback");
          return res.json(
            await fallbackFlow(userMessage, confidence, faqResponse.matches)
          );
        }

        logger.info("FAQ flow: match → returning FAQ answer");
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


      default:
        logger.info("Routing: default → safe fallback");
        return res.json(await fallbackFlow(userMessage, confidence, []));

    }


    return res.json(response);

  } catch (err) {
    logger.error("Error in flow:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Virtual agent server running on port ${PORT}`);
});
