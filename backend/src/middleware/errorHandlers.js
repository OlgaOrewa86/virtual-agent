import logger from '../utils/logger.js';

// 404 handler
export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// Global error handler
export function globalErrorHandler(err, req, res, next) {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack
  });

  if (err?.type === 'entity.parse.failed') {
    return res.status(500).json({ error: err.message || 'Invalid JSON' });
  }

  res.status(500).json({ error: 'Internal server error' });
}
