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

  // 1. Classify intent
  const intent = await classifyIntent(userMessage);
  logger.info(`Detected intent: ${intent}`);

  try {
    let response;

    switch (intent) {
      case "faq": {
        const faqResponse = await faqFlow(userMessage);

        // If FAQ flow couldn't answer → fallback to LLM
        if (faqResponse.intent === "faq_no_match") {
          logger.info("FAQ no match → routing to fallback LLM");
          response = await fallbackFlow(userMessage);
        } else {
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

      case "fallback":
      default:
        response = await fallbackFlow(userMessage);
        break;
    }

    return res.json(response);

  } catch (err) {
    logger.error("Error in flow:", err);

    return res.status(500).json({
      error: "Something went wrong"
    });
  }
});


// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Virtual agent server running on port ${PORT}`);
});
