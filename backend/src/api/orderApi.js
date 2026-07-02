// src/api/orderApi.js
import logger from '../utils/logger.js';

// Mock database of orders
const mockOrders = {
  12345: { status: 'Processing' },
  23456: { status: 'Shipped' },
  34567: { status: 'Out for delivery' },
  45678: { status: 'Delivered' },
  56789: { status: 'Cancelled' }
};

export default function orderApi(req, res) {
  const orderId = req.params.id;

  logger.info(`Mock API called for order: ${orderId}`);

  const order = mockOrders[orderId];

  if (!order) {
    logger.info(`Order not found: ${orderId}`);
    return res.json({ error: 'not found' });
  }

  return res.json({
    id: orderId,
    status: order.status
  });
}
