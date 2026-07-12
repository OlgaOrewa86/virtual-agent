import rateLimit from "express-rate-limit";

// Soft limit for user messages (API Gateway enforces hard limit)
export const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});

// Events polling limiter
export const eventsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});

// Routing UI limiter (dev only)
export const routingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false
});

// Orders API limiter
export const ordersLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false
});
