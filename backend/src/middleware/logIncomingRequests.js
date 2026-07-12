// src/middleware/logIncomingRequests.js
import logger from "../utils/logger.js";

export function logIncomingRequests(req, res, next) {
  // Suppress noisy polling logs from /events
  if (req.path !== "/events") {
    logger.info(`Incoming request: ${req.method} ${req.path}`);
  }
  next();
}
