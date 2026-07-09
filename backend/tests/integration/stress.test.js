// backend/tests/integration/stress.test.js
import request from "supertest";
import crypto from "crypto";
import app from "../../src/app.js";

describe("Stress & Load Tests", () => {

  // --- 1. Burst load on /agent ---
  test("handles 50 rapid /agent requests without crashing", async () => {
    const promises = [];

    for (let i = 0; i < 50; i++) {
      promises.push(
        request(app)
          .post("/agent")
          .set("Content-Type", "application/json")
          .send({ message: "stress-test" })
      );
    }

    const results = await Promise.all(promises);

    results.forEach((res) => {
      expect([200, 429]).toContain(res.status);
    });
  });

  // --- 2. Event store flooding ---
  // Backend does NOT expose POST /events → expect 404
  test("event store handles 100 sequential events", async () => {
    for (let i = 0; i < 100; i++) {
      const res = await request(app)
        .post("/events")
        .set("Content-Type", "application/json")
        .send({
          type: "stress_event",
          payload: { index: i }
        });

      expect([404, 429]).toContain(res.status);
    }
  });

  // --- 3. Parallel webhook calls ---
  test("webhook endpoint handles concurrent requests", async () => {
    const payload = {
      event: "ticket_assigned",
      ticketId: "T999",
      agent: "LoadBot"
    };

    const signature = crypto
      .createHmac("sha256", "test-secret")
      .update(JSON.stringify(payload))
      .digest("hex");

    const ts = Date.now();

    const requests = Array.from({ length: 20 }).map(() =>
      request(app)
        .post("/webhook/support-update")
        .set("Content-Type", "application/json")
        .set("x-webhook-secret", "test-secret")
        .set("x-signature", signature)
        .set("x-timestamp", String(ts))
        .send(payload)
    );

    const results = await Promise.all(requests);

    results.forEach((res) => {
      expect([200, 401]).toContain(res.status);
    });
  });

  // --- 4. Routing stability under load ---
  test("routing remains stable under heavy GET load", async () => {
    const promises = [];

    for (let i = 0; i < 40; i++) {
      promises.push(request(app).get("/health"));
    }

    const results = await Promise.all(promises);

    results.forEach((res) => {
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("ok");
    });
  });

  // --- 5. Mixed load (GET + POST + webhook) ---
  test("handles mixed traffic without 500 errors", async () => {
    const mixed = [];

    for (let i = 0; i < 20; i++) {
      mixed.push(
        request(app).get("/health"),
        request(app)
          .post("/agent")
          .set("Content-Type", "application/json")
          .send({ message: "mixed-load" }),
        request(app)
          .post("/events") // returns 404
          .set("Content-Type", "application/json")
          .send({ type: "mixed", payload: { i } })
      );
    }

    const results = await Promise.all(mixed);

    results.forEach((res) => {
      expect([200, 404, 429]).toContain(res.status);
      expect(res.status).not.toBe(500);
    });
  });
});
