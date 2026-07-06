// src/middleware/requestLogger.js
import logger from '../utils/logger.js';

export default function requestLogger(req, res, next) {
  const { method, url } = req;
  const body = req.body;

  // Suppress noisy polling logs
  if (req.path !== '/events') {
    const safeBody =
      body && typeof body === 'object'
        ? {
            keys: Object.keys(body),
            hasMessage: typeof body.message === 'string',
            messageLength: typeof body.message === 'string' ? body.message.length : 0
          }
        : body;

    logger.info('Incoming request', { method, url, body: safeBody });
  }

  next();
}
