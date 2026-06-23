// src/intents/patterns.js
export default {
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
      /what.*time.*open/,
      /when.*close/,
      /where.*(store|location)/,
      /how.*refund/,
      /what.*refund.*policy/
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
      /where.*order/,
      /track.*order/,
      /order.*status/,
      /package.*(arrive|coming|delivered)/
    ]
  },

escalate: {
  keywords: [
    "human",
    "agent",
    "representative",
    "talk to someone",
    "escalate",
    "contact",
    "contact us",
    "contact support",
    "customer service",
    "phone",
    "phone number",
    "email",
    "reach you"
  ],
  regex: [
    /speak.*(agent|human)/,
    /talk.*(agent|human)/,
    /need.*help.*human/,
    /escalate/,
    /contact/,
    /customer.*service/,
    /how.*(contact|reach)/,
    /phone.*(number)?/,
    /email/
  ]
},

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
      /^hi\b/,
      /^hello\b/,
      /^hey\b/,
      /thank(s| you)/,
      /bye/,
      /good\s*(morning|afternoon|evening)/,
      /(lol|haha|hehe)/
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
    /cancel.*(escalation|request)/,
    /stop.*(escalation|request)/,
    /never mind/
  ]
},
  help: {
    keywords: [
      "help",
      "info",
      "information",
      "more help",
      "support",
      "assist",
      "what can you do"
    ],
    regex: [
      /help/,
      /info/,
      /information/,
      /what.*(can|do).*you/
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
      /^faq$/,
      /^faqs$/,
      /show.*faq/,
      /more.*faq/,
      /faq.*list/
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
support_request: {
  keywords: [
    "support",
    "ticket",
    "support request",
    "submit support",
    "create ticket",
    "open ticket",
    "raise ticket",
    "report issue",
    "report problem",
    "bug report",
    "help request"
  ],
  regex: [
    /support.*request/i,
    /support.*req/i,
    /sup+ort/i,                     // typo tolerant
    /submit.*(ticket|request)/i,
    /create.*(ticket|support)/i,
    /open.*(ticket|support)/i,
    /raise.*ticket/i,
    /support.*ticket/i,
    /report.*(issue|problem|bug)/i,
    /file.*(ticket|request)/i,
    /need.*(help|support)/i
  ]
}



};
