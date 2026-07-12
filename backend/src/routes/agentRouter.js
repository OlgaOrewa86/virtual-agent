import express from "express";
import { agentController } from "../controllers/agentController.js";
import { agentMessageSchema } from "../validation/schemas.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  const parsed = agentMessageSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  req.body.message = parsed.data.message;
  next();
}, agentController);

export default router;
