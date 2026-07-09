// backend/tests/integration/webhook.test.js
import request from "supertest";
import crypto from "crypto";
import app from "../../src/app.js";

const WEBHOOK_SECRET = "test-secret"; // from your test setup
const endpoint = "/webhook/support-update";

// Utility: create valid HMAC signature
function sign(body) {
  return crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest("hex");
}

describe("Webhook Security", () => {
  const validPayload = {
    event: "ticket_assigned",
    ticketId: "T123",
    agent: "Alice"
  };

  const now = Date.now();

  test("accepts a fully valid webhook request", async () => {
    const signature = sign(validPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-signature", signature)
      .set("x-timestamp", String(now))
      .send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  // --- Missing secret header ---
  test("rejects missing x-webhook-secret", async () => {
    const signature = sign(validPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-signature", signature)
      .set("x-timestamp", String(now))
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  // --- Wrong secret ---
  test("rejects invalid webhook secret", async () => {
    const signature = sign(validPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", "wrong-secret")
      .set("x-signature", signature)
      .set("x-timestamp", String(now))
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Unauthorized");
  });

  // --- Missing signature ---
  test("rejects missing x-signature", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-timestamp", String(now))
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing signature");
  });

  // --- Invalid signature ---
  test("rejects invalid signature", async () => {
    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-signature", "not-a-valid-hmac")
      .set("x-timestamp", String(now))
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid signature");
  });

  // --- Missing timestamp ---
  test("rejects missing timestamp", async () => {
    const signature = sign(validPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-signature", signature)
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Missing timestamp");
  });

  // --- Expired timestamp (older than 5 minutes) ---
  test("rejects expired timestamp", async () => {
    const oldTs = now - 10 * 60 * 1000; // 10 minutes ago
    const signature = sign(validPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-signature", signature)
      .set("x-timestamp", String(oldTs))
      .send(validPayload);

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Request expired");
  });

  // --- Zod validation failure ---
  test("rejects invalid payload (Zod)", async () => {
    const badPayload = { event: 123 }; // invalid type
    const signature = sign(badPayload);

    const res = await request(app)
      .post(endpoint)
      .set("Content-Type", "application/json")
      .set("x-webhook-secret", WEBHOOK_SECRET)
      .set("x-signature", signature)
      .set("x-timestamp", String(now))
      .send(badPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
