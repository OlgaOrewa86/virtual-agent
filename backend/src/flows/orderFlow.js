// src/flows/orderFlow.js
import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";

// --- Helper: extract order number from message ---
function extractOrderNumber(text) {
  const match = text.match(/\b\d{5,10}\b/); // matches 5–10 digit numbers
  return match ? match[0] : null;
}

export default async function orderFlow(userMessage) {
  const orderNumber = extractOrderNumber(userMessage);

  if (!orderNumber) {
    logger.info("No order number found in message");

    return buildResponse({
      text: "Can you please provide your order number?",
      intent: "order_status_missing_number",
      entities: {},
      source: "rule",

      // ⭐ Buttons help guide the user
      buttons: [
        { label: "Talk to support", value: "talk to human" }
      ]
    });
  }

  logger.info(`Extracted order number: ${orderNumber}`);

  try {
    const response = await fetch(`http://localhost:3001/api/orders/${orderNumber}`);
    const data = await response.json();

    if (data.error) {
      return buildResponse({
        text: `I couldn't find an order with number ${orderNumber}.`,
        intent: "order_status_not_found",
        entities: { orderId: orderNumber },
        source: "api",

        // ⭐ Optional card for “not found”
        card: {
          type: "order_not_found",
          title: `Order #${orderNumber}`,
          message: "This order does not exist in our system."
        },

        buttons: [
          { label: "Try another order", value: "check order" },
          { label: "Talk to support", value: "talk to human" }
        ]
      });
    }

    // ⭐ SUCCESS — return a rich order card
    return buildResponse({
      text: `Your order ${orderNumber} is currently: ${data.status}.`,
      intent: "order_status",
      entities: { orderId: orderNumber },
      source: "api",

      card: {
        type: "order_status",
        title: `Order #${orderNumber}`,
        status: data.status,
       link: `http://localhost:3000/orders/${orderNumber}`



      },

      buttons: [
        { label: "Track Order", value: `Track order ${orderNumber}` },
        { label: "More help", value: "talk to human" }
      ]
    });

  } catch (err) {
    logger.error("Order API error:", err);

    return buildResponse({
      text: "Sorry, I had trouble checking your order. Please try again shortly.",
      intent: "order_status_error",
      entities: { orderId: orderNumber },
      source: "api",

      card: {
        type: "error",
        title: "Order lookup failed",
        message: "The system could not retrieve your order."
      },

      buttons: [
        { label: "Try again", value: `Check order ${orderNumber}` },
        { label: "Talk to support", value: "talk to human" }
      ]
    });
  }
}
