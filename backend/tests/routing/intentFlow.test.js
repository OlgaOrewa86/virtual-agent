/**
 * intentFlow.test.js
 *
 * Tests intent → next_state routing logic.
 * Ensures that every intent in routing.json maps to the correct flow.
 */

import classifyIntent from "../../src/intents/intentClassifier.js";
import routing from "../../src/routing/routing.json" with { type: "json" };



describe("Routing: intent → next_state mapping", () => {

  const mapIntentToState = (intent) => {
    return routing.intents[intent]?.next_state || "fallbackFlow";
  };

  // ---------------------------------------------------------
  // SUPPORT REQUEST
  // ---------------------------------------------------------
  it("routes support_request → supportRequestFlow", async () => {
    const r = await classifyIntent("I need to submit a support ticket");
    expect(r.intent).toBe("support_request");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("supportRequestFlow");
  });

  // ---------------------------------------------------------
  // ORDER STATUS
  // ---------------------------------------------------------
  it("routes order_status → orderFlow", async () => {
    const r = await classifyIntent("where is my order");
    expect(r.intent).toBe("order_status");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("orderFlow");
  });

  it("order number overrides → orderFlow", async () => {
    const r = await classifyIntent("help 987654");
    expect(r.intent).toBe("order_status");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("orderFlow");
  });

  // ---------------------------------------------------------
  // ESCALATION
  // ---------------------------------------------------------
  it("routes escalate → escalationFlow", async () => {
    const r = await classifyIntent("I want to talk to a human");
    expect(r.intent).toBe("escalate");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("escalationFlow");
  });

  // ---------------------------------------------------------
  // CANCEL ESCALATION
  // ---------------------------------------------------------
  it("routes cancel_escalation → cancelEscalationFlow", async () => {
    const r = await classifyIntent("never mind");
    expect(r.intent).toBe("cancel_escalation");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("cancelEscalationFlow");
  });

  // ---------------------------------------------------------
  // FAQ
  // ---------------------------------------------------------
  it("routes faq → faqFlow", async () => {
    const r = await classifyIntent("what time do you open");
    expect(r.intent).toBe("faq");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("faqFlow");
  });

  // ---------------------------------------------------------
  // FAQ LIST
  // ---------------------------------------------------------
  it("routes faq_list → faqListFlow", async () => {
    const r = await classifyIntent("show me the faqs");
    expect(r.intent).toBe("faq_list");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("faqListFlow");
  });

  // ---------------------------------------------------------
  // PRODUCT LOOKUP
  // ---------------------------------------------------------
  it("routes product_lookup → productFlow", async () => {
    const r = await classifyIntent("show product 42");
    expect(r.intent).toBe("product_lookup");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("productFlow");
  });

  // ---------------------------------------------------------
  // LIST PRODUCTS
  // ---------------------------------------------------------
  it("routes list_products → listProductsFlow", async () => {
    const r = await classifyIntent("show me your products");
    expect(r.intent).toBe("list_products");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("listProductsFlow");
  });

  // ---------------------------------------------------------
  // SMALLTALK
  // ---------------------------------------------------------
  it("routes smalltalk → smalltalkFlow", async () => {
    const r = await classifyIntent("hello");
    expect(r.intent).toBe("smalltalk");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("smalltalkFlow");
  });

  // ---------------------------------------------------------
  // HELP
  // ---------------------------------------------------------
  it("routes help → helpFlow", async () => {
    const r = await classifyIntent("I need help");
    expect(r.intent).toBe("help");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("helpFlow");
  });

  // ---------------------------------------------------------
  // FALLBACK
  // ---------------------------------------------------------
  it("routes fallback → fallbackFlow", async () => {
    const r = await classifyIntent("asdfghjkl");
    expect(r.intent).toBe("fallback");

    const next = mapIntentToState(r.intent);
    expect(next).toBe("fallbackFlow");
  });

});
