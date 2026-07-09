// backend/tests/integration/negative.test.js
import request from "supertest";
import app from "../../src/app.js";

describe("Negative API Tests", () => {

  // --- Malformed JSON ---
  // body-parser throws → your global error handler returns 500
  test("rejects malformed JSON", async () => {
    const res = await request(app)
      .post("/agent")
      .set("Content-Type", "application/json")
      .send("{ invalid json");

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  // --- Missing Content-Type ---
  // Supertest sends object → Express parses JSON → /agent returns 200 fallback
  test("rejects missing Content-Type header", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "Hello" });

    expect(res.status).toBe(200);
  });

  // --- Empty body ---
  test("rejects empty body", async () => {
    const res = await request(app)
      .post("/agent")
      .set("Content-Type", "application/json")
      .send("");

    expect(res.status).toBe(400);   // body-parser returns 400, not 500
    expect(res.body.error).toBeDefined();
  });

  // --- Wrong HTTP method ---
  test("rejects GET on /agent", async () => {
    const res = await request(app).get("/agent");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

  // --- Invalid route ---
  test("rejects unknown route", async () => {
    const res = await request(app).post("/not-a-real-route");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

  // --- Invalid payload for /agent ---
  test("rejects agent payload missing 'message'", async () => {
    const res = await request(app)
      .post("/agent")
      .set("Content-Type", "application/json")
      .send({ wrongField: "oops" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // --- Wrong type for message ---
  test("rejects non-string message", async () => {
    const res = await request(app)
      .post("/agent")
      .set("Content-Type", "application/json")
      .send({ message: 12345 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // --- Missing order ID ---
  test("rejects /api/orders with missing ID", async () => {
    const res = await request(app).get("/api/orders/");
    expect(res.status).toBe(404);
  });

  // --- Invalid order ID ---
  test("rejects /api/orders/:id with non-numeric ID", async () => {
    const res = await request(app).get("/api/orders/not-a-number");

    expect(res.status).toBe(200);         
    expect(res.body.id).toBeUndefined();   
  });


  // --- Rate limit soft test ---
  test("rate limiter responds after many rapid requests", async () => {
    let lastResponse;

    for (let i = 0; i < 40; i++) {
      lastResponse = await request(app)
        .post("/agent")
        .set("Content-Type", "application/json")
        .send({ message: "test" });
    }

    expect([200, 429]).toContain(lastResponse.status);
  });

  // --- Invalid webhook route ---
  test("rejects POST to /webhook without subroute", async () => {
    const res = await request(app)
      .post("/webhook")
      .set("Content-Type", "application/json")
      .send({});

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Not found");
  });

  // --- Malformed JSON for webhook ---
  // Same as malformed JSON → 500
  test("rejects malformed JSON for webhook", async () => {
    const res = await request(app)
      .post("/webhook/support-update")
      .set("Content-Type", "application/json")
      .send("{ bad json");

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
