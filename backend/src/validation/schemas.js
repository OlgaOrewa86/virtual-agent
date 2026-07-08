import { z } from "zod";

// --- Agent message schema ---
export const agentMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message too long")
    .trim()
    .refine((val) => /^[\p{L}\p{N}\p{P}\p{Z}]+$/u.test(val), {
      message: "Invalid characters in message"
    })
});

// --- Webhook schema ---
export const webhookSchema = z.object({
  event: z.string().min(1).max(100),
  ticketId: z.string().min(1).max(50),
  agent: z.string().min(1).max(100)
});
