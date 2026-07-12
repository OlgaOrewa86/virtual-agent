import logger from "../utils/logger.js";

// 404 handler
export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found" });
}

// Global error handler
export function globalErrorHandler(err, req, res) {
  logger.error("Unhandled error", {
    error: err.message,
    stack: err.stack
  });

  res.status(500).json({ error: "Internal server error" });
}
