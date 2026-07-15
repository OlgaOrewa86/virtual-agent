import crypto from "crypto";
import { webhookSchema } from "../validation/schemas.js";
import logger from "../utils/logger.js";

export function verifyWebhook(secret) {
  return (req, res, next) => {

    // Allow mock service in development mode
    if (process.env.NODE_ENV === "development") {
      // Still validate payload shape for security
      const parsed = webhookSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.issues[0].message });
      }

      req.webhookData = parsed.data;
      logger.info(
        `Webhook (dev mode): ${parsed.data.event} for ${parsed.data.ticketId} (agent: ${parsed.data.agent})`
      );
      return next();
    }

    // ⭐ Production mode: full security checks

    // 1. Secret header check
    const providedSecret = req.get("x-webhook-secret");
    if (secret && providedSecret !== secret) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 2. HMAC signature check
    const signature = req.get("x-signature");
    if (!signature) {
      return res.status(401).json({ error: "Missing signature" });
    }

    const computed = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (computed !== signature) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // 3. Timestamp replay protection
    const timestamp = req.get("x-timestamp");
    if (!timestamp) {
      return res.status(401).json({ error: "Missing timestamp" });
    }

    const ts = Number(timestamp);
    const now = Date.now();

    if (Math.abs(now - ts) > 5 * 60 * 1000) {
      return res.status(401).json({ error: "Request expired" });
    }

    // 4. Validate payload with Zod
    const parsed = webhookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    req.webhookData = parsed.data;

    logger.info(
      `Webhook verified: ${parsed.data.event} for ${parsed.data.ticketId} (agent: ${parsed.data.agent})`
    );

    next();
  };
}
