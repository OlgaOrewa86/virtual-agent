import { sanitizeInput } from "../middleware/sanitize.js";
import { safeLogInput } from "../utils/logSanitizer.js";
import classifyIntent from "../intents/intentClassifier.js";

import faqFlow from "../flows/faqFlow.js";
import orderFlow from "../flows/orderFlow.js";
import escalationFlow from "../flows/escalationFlow.js";
import fallbackFlow from "../flows/fallbackFlow.js";
import smalltalkFlow from "../flows/smalltalkFlow.js";
import cancelEscalationFlow from "../flows/cancelEscalationFlow.js";
import helpFlow from "../flows/helpFlow.js";
import faqListFlow from "../flows/faqListFlow.js";
import productFlow from "../flows/productFlow.js";
import listProductsFlow from "../flows/listProductsFlow.js";
import supportRequestFlow from "../flows/supportRequestFlow.js";

import { buildResponse } from "../utils/responseBuilder.js";
import logger from "../utils/logger.js";

export async function agentController(req, res) {
  const userMessage = sanitizeInput(req.body.message);
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
          source: "rule"
        })
      );
    }

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
  } catch (err) {
    logger.error("Error in agent flow:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
