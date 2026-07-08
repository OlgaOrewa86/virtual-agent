// src/flows/orderFlow.js
import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";
import { URL } from "url";
import { AbortController } from "abort-controller";


// --- Extract order number (5–10 digits) ---
function extractOrderNumber(text) {
  const match = text.match(/\b\d{5,10}\b/);
  return match ? match[0] : null;
}

// --- Validate order number strictly ---
function validateOrderNumber(orderNumber) {
  return /^[0-9]{5,10}$/.test(orderNumber);
}

export default async function orderFlow(userMessage) {
  const orderNumber = extractOrderNumber(userMessage);

  if (!orderNumber || !validateOrderNumber(orderNumber)) {
    logger.info("No valid order number found in message");

    return buildResponse({
      text: "Can you please provide your order number?",
      intent: "order_status_missing_number",
      entities: {},
      source: "rule",
      buttons: [
        { label: "Talk to support", value: "talk to human" }
      ]
    });
  }

  logger.info(`Extracted order number: ${Number(orderNumber)}`);

  // Build safe URL
  const apiUrl = new URL("http://localhost:3001/api/orders/");
  apiUrl.pathname += orderNumber;

  try {
    // Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeout);

    const data = await response.json();

    if (data.error) {
      return buildResponse({
        text: `I couldn't find an order with number ${orderNumber}.`,
        intent: "order_status_not_found",
        entities: { orderId: orderNumber },
        source: "api",
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

    // SUCCESS — return rich order card
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
