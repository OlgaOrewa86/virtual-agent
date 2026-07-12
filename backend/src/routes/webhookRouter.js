import express from "express";
import { verifyWebhook } from "../middleware/verifyWebhook.js";
import { webhookController } from "../controllers/webhookController.js";

const router = express.Router();

export default function createWebhookRouter(secret) {
  router.post("/support-update", verifyWebhook(secret), webhookController);
  return router;
}
