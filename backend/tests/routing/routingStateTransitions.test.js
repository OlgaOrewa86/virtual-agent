/**
 * routingStateTransitions.test.js
 *
 * Tests runtime routing transitions through the /agent endpoint.
 * Ensures correct flow execution based on:
 * - intent
 * - confidence
 * - flow branching (FAQ success/no-match)
 * - fallback logic
 * - escalation cancellation
 */

import { jest } from "@jest/globals";

jest.mock("../../src/services/productService.js", () => ({
  getAllProducts: jest.fn().mockResolvedValue([
    { id: 1, title: "Test Product 1" },
    { id: 2, title: "Test Product 2" }
  ]),
  getProductById: jest.fn().mockResolvedValue({
    id: 1,
    title: "Test Product 1"
  })
}));

import request from "supertest";

let app;
beforeAll(async () => {
  // IMPORTANT: dynamic import so Jest mock is applied
  app = (await import("../../src/app.js")).default;
});



describe("Routing: state transition behaviour (/agent endpoint)", () => {

  // ---------------------------------------------------------
  // FALLBACK (confidence = 0)
  // ---------------------------------------------------------
  it("routes to fallbackFlow when confidence = 0", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "asdfghjkl" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("fallback_llm");

  });

  // ---------------------------------------------------------
  // CLARIFICATION (confidence = 1)
  // ---------------------------------------------------------
  it("returns clarification message when confidence = 1", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "help me" }); // weak match

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("help");
  });

  // ---------------------------------------------------------
  // FAQ FLOW — SUCCESS
  // ---------------------------------------------------------
  it("routes faq intent → faqFlow (success)", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "what time do you open" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("faq");

  });

  // ---------------------------------------------------------
  // FAQ FLOW — NO MATCH → fallbackFlow
  // ---------------------------------------------------------
  it("routes faq intent → fallbackFlow when FAQ has no match", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "what is the meaning of life" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("fallback_llm");

  });

  // ---------------------------------------------------------
  // ORDER FLOW
  // ---------------------------------------------------------
  it("routes order_status intent → orderFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "where is my order" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("order_status_missing_number");

  });

  // ---------------------------------------------------------
  // ESCALATION FLOW
  // ---------------------------------------------------------
  it("routes escalate intent → escalationFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "I want to talk to a human" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("escalate_to_human");

  });

  // ---------------------------------------------------------
  // CANCEL ESCALATION FLOW
  // ---------------------------------------------------------
  it("routes cancel_escalation intent → cancelEscalationFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "never mind" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("cancel_escalation");
  });

  // ---------------------------------------------------------
  // SMALLTALK FLOW
  // ---------------------------------------------------------
  it("routes smalltalk intent → smalltalkFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "hello" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("smalltalk");
  });

  // ---------------------------------------------------------
  // HELP FLOW
  // ---------------------------------------------------------
  it("routes help intent → helpFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "what can you do" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("help");
  });

  // ---------------------------------------------------------
  // FAQ LIST FLOW
  // ---------------------------------------------------------
  it("routes faq_list intent → faqListFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "show me the faqs" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("faq_list");
  });

  // ---------------------------------------------------------
  // PRODUCT LOOKUP FLOW
  // ---------------------------------------------------------
  it("routes product_lookup intent → productFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "show product 1" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("product_lookup_success");

  });

  // ---------------------------------------------------------
  // LIST PRODUCTS FLOW
  // ---------------------------------------------------------
  it("routes list_products intent → listProductsFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "show products" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("list_products_success");

  });

  // ---------------------------------------------------------
  // SUPPORT REQUEST FLOW
  // ---------------------------------------------------------
  it("routes support_request intent → supportRequestFlow", async () => {
    const res = await request(app)
      .post("/agent")
      .send({ message: "I need to submit a support ticket" });

    expect(res.status).toBe(200);
    expect(res.body.intent).toBe("support_request");
  });

});
