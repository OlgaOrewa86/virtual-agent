// src/middleware/requestLogger.js
import logger from "../utils/logger.js";

export default function requestLogger(req, res, next) {
  const { method, url } = req;
  const body = req.body;

  // Suppress noisy polling logs
  if (req.path !== "/events") {
    logger.info(`Incoming request: ${method} ${url}`);

    if (body && Object.keys(body).length > 0) {
      logger.info(`Request body: ${JSON.stringify(body)}`);
    }
  }

  next();
}
