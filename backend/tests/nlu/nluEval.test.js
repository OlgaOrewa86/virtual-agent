import classifyIntent from '../../src/intents/intentClassifier.js';

describe('NLU Evaluation Suite (Rule‑Based)', () => {

  // ---------------------------------------------------------
  // INTENT COVERAGE TESTS (10)
  // ---------------------------------------------------------

  it('detects faq intent', async () => {
    const r = await classifyIntent('what time do you open');
    expect(r.intent).toBe('faq');
    expect(r.confidence).toBeGreaterThanOrEqual(3);
  });

  it('detects order_status intent', async () => {
    const r = await classifyIntent('where is my order');
    expect(r.intent).toBe('order_status');
    expect(r.confidence).toBeGreaterThanOrEqual(3);
  });

  it('detects escalate intent', async () => {
    const r = await classifyIntent('I want to talk to a human');
    expect(r.intent).toBe('escalate');
    expect(r.confidence).toBeGreaterThanOrEqual(3);
  });

  it('detects smalltalk intent', async () => {
    const r = await classifyIntent('hello');
    expect(r.intent).toBe('smalltalk');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects cancel_escalation intent', async () => {
    const r = await classifyIntent('never mind');
    expect(r.intent).toBe('cancel_escalation');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects help intent', async () => {
    const r = await classifyIntent('I need help');
    expect(r.intent).toBe('help');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects faq_list intent', async () => {
    const r = await classifyIntent('show me the faqs');
    expect(r.intent).toBe('faq_list');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects product_lookup intent', async () => {
    // IMPORTANT: cannot use 5–10 digit numbers because they trigger order_status override
    const r = await classifyIntent('show product 42');
    expect(r.intent).toBe('product_lookup');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects list_products intent', async () => {
    const r = await classifyIntent('show me your products');
    expect(r.intent).toBe('list_products');
    expect(r.confidence).toBeGreaterThanOrEqual(2);
  });

  it('detects support_request intent', async () => {
    const r = await classifyIntent('I need to submit a support ticket');
    expect(r.intent).toBe('support_request');
    expect(r.confidence).toBeGreaterThanOrEqual(1);
  });

  // ---------------------------------------------------------
  // EDGE‑CASE TESTS (5)
  // ---------------------------------------------------------

  it('returns fallback for empty message', async () => {
    const r = await classifyIntent('');
    expect(r.intent).toBe('fallback');
    expect(r.confidence).toBe(0);
  });

  it('returns fallback for nonsense text', async () => {
    const r = await classifyIntent('asdfghjkl');
    expect(r.intent).toBe('fallback');
    expect(r.confidence).toBe(0);
  });

  it('returns low confidence for ambiguous text', async () => {
    const r = await classifyIntent('I need something');
    expect(r.confidence).toBeLessThanOrEqual(2);
  });

  it('order number forces order_status regardless of wording', async () => {
    const r = await classifyIntent('help 987654');
    expect(r.intent).toBe('order_status');
    expect(r.confidence).toBe(5);
  });

  it('support_request keywords do not overpower other intents', async () => {
    const r = await classifyIntent('I need support with my order 12345');
    expect(r.intent).toBe('order_status');
    expect(r.confidence).toBe(5);
  });

});
