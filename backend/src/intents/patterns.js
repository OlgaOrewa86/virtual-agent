export default {

  // -----------------------------
  // 1. HIGH‑PRIORITY ACTION INTENTS
  // -----------------------------

  support_request: {
    keywords: [
      "submit ticket",
      "create ticket",
      "open ticket",
      "raise ticket",
      "file ticket",
      "support request",
      "bug report",
      "support ticket"
    ],
    regex: [
      /create.*(ticket|support.*ticket)/i,
      /open.*(ticket|support)/i,
      /submit.*(ticket|request)/i,
      /raise.*ticket/i,
      /file.*(ticket|request)/i,
      /report.*bug/i,
      /support.*ticket/i
    ]
  },

  order_status: {
    keywords: [
      "track",
      "order",
      "status",
      "where is my",
      "order number",
      "package"
    ],
    regex: [
      /where.*order/i,
      /track.*order/i,
      /order.*status/i,
      /package.*(arrive|coming|delivered)/i
    ]
  },

  escalate: {
    keywords: [
      "human",
      "agent",
      "representative",
      "talk to someone",
      "escalate",
      "customer service",
      "phone",
      "phone number",
      "email",
      "reach you"
    ],
    regex: [
      /speak.*(agent|human)/i,
      /talk.*(agent|human)/i,
      /need.*help.*human/i,
      /escalate/i,
      /customer.*service/i,
      /how.*(contact|reach)/i,
      /phone.*(number)?/i,
      /email/i
    ]
  },

  cancel_escalation: {
    keywords: [
      "cancel escalation",
      "cancel request",
      "stop escalation",
      "never mind",
      "cancel",
      "stop"
    ],
    regex: [
      /cancel.*(escalation|request)/i,
      /stop.*(escalation|request)/i,
      /never mind/i
    ]
  },

  // -----------------------------
  // 2. INFORMATIONAL INTENTS
  // -----------------------------

  faq: {
    keywords: [
      "hours",
      "open",
      "close",
      "location",
      "store location",
      "refund",
      "return policy",
      "shipping",
      "delivery times"
    ],
    regex: [
      /what.*time.*open/i,
      /when.*close/i,
      /where.*(store|location)/i,
      /how.*refund/i,
      /what.*refund.*policy/i
    ]
  },

  faq_list: {
    keywords: [
      "faq",
      "faqs",
      "show faqs",
      "more faqs",
      "faq list",
      "show questions",
      "more questions",
      "all faqs"
    ],
    regex: [
      /^faq$/i,
      /^faqs$/i,
      /show.*faq/i,
      /more.*faq/i,
      /faq.*list/i
    ]
  },

  product_lookup: {
    keywords: ["product", "products", "item"],
    regex: [
      /product\s+\d+/i,
      /show\s+product\s+\d+/i,
      /item\s+\d+/i
    ]
  },

  list_products: {
    keywords: [
      "products",
      "product list",
      "list products",
      "show products",
      "all products",
      "what products",
      "sell",
      "catalog",
      "inventory"
    ],
    regex: [
      /list.*products/i,
      /show.*products/i,
      /all.*products/i,
      /what.*products/i,
      /what.*sell/i,
      /products$/i
    ]
  },

  // -----------------------------
  // 3. GENERIC INTENTS (LOW PRIORITY)
  // -----------------------------

  smalltalk: {
    keywords: [
      "hi",
      "hello",
      "hey",
      "thanks",
      "thank you",
      "bye",
      "goodbye",
      "morning",
      "afternoon",
      "evening",
      "lol",
      "haha"
    ],
    regex: [
      /^hi\b/i,
      /^hello\b/i,
      /^hey\b/i,
      /thank(s| you)/i,
      /bye/i,
      /good\s*(morning|afternoon|evening)/i,
      /(lol|haha|hehe)/i
    ]
  },

  help: {
    keywords: [
      "help",
      "info",
      "information",
      "assist",
      "what can you do",
      "more help"
    ],
    regex: [
      /help/i,
      /info/i,
      /information/i,
      /what.*(can|do).*you/i
    ]
  }

};
