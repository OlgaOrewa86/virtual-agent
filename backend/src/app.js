// src/app.js
import express from "express";
import requestLogger from "./middleware/requestLogger.js";

import { applySecurity } from "./config/security.js";
import {
  messageLimiter,
  eventsLimiter,
  ordersLimiter
} from "./config/rateLimits.js";

import agentRouter from "./routes/agentRouter.js";
import eventsRouter from "./routes/eventsRouter.js";
import orderRouter from "./routes/orderRouter.js";
import healthRouter from "./routes/healthRouter.js";
import createWebhookRouter from "./routes/webhookRouter.js";
import routingRouter from "./routes/routingRouter.js";
import routingUiRouter from "./routes/routingUiRouter.js";

import { notFoundHandler, globalErrorHandler } from "./middleware/errorHandlers.js";
import { initWebhookSecret } from "./config/webhookSecrets.js";
import { ENV } from "./config/env.js";
import { logIncomingRequests } from "./middleware/logIncomingRequests.js";


const app = express();

// --- Security ---
applySecurity(app, ENV.corsOrigin);

// --- Rate limiting ---
app.use("/agent", messageLimiter);
app.use("/webhook", messageLimiter);
app.use("/events", eventsLimiter);
app.use("/api/orders", ordersLimiter);

// --- Secrets loading ---
const { webhookSecret, secretsReady } = await initWebhookSecret(ENV);

// --- Webhook router ---
app.use("/webhook", createWebhookRouter(webhookSecret, secretsReady));

// --- Logging ---
app.use(logIncomingRequests);
app.use(requestLogger);

// --- Routes ---
app.use("/agent", agentRouter);
app.use("/events", eventsRouter);
app.use("/api/orders", orderRouter);
app.use("/health", healthRouter);

if (!ENV.isProd) {
  app.use("/routing", routingRouter);
  app.use("/routing-ui", routingUiRouter);
}


// --- Error handlers ---
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
