// src/api/orderApi.js
import logger from "../utils/logger.js";

// Mock database of orders
const mockOrders = {
  12345: { status: "Processing" },
  23456: { status: "Shipped" },
  34567: { status: "Out for delivery" },
  45678: { status: "Delivered" },
  56789: { status: "Cancelled" }
};

// Validate order ID (5–10 digits)
function validateOrderId(id) {
  return /^[0-9]{5,10}$/.test(id);
}

export default function orderApi(req, res) {
  const rawId = req.params.id;

  if (!validateOrderId(rawId)) {
    logger.warn(`Invalid order ID format: ${rawId}`);
    return res.json({ error: "invalid_id" });
  }

  const orderId = Number(rawId);
  logger.info(`Mock API lookup for order: ${orderId}`);

  const order = mockOrders[orderId];

  if (!order) {
    logger.info(`Order not found: ${orderId}`);
    return res.json({ error: "not_found" });
  }

  return res.json({
    id: orderId,
    status: order.status
  });
}
