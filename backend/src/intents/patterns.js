export default {

support_request: {
  keywords: [
    "submit ticket",
    "create ticket",
    "open ticket",
    "raise ticket",
    "file ticket",
    "support request",
    "bug report",
    "support ticket",
    "broken item",
    "damaged item",
    "faulty item",
    "issue",
    "problem",
    "report issue",
    "report a problem",
    "need support",
    "need help",
    "need assistance",
    "item not working",
    "item is broken"
  ],
  regex: [
    "create.*(ticket|support.*ticket)",
    "open.*(ticket|support)",
    "submit.*(ticket|request)",
    "raise.*ticket",
    "file.*(ticket|request)",
    "report.*bug",
    "support.*ticket",
    "broken.*item",
    "damaged\\s*item",
    "faulty\\s*item",
    "(report|submit).*issue",
    "(report|submit).*problem",
    "need.*(support|help|assistance)",
    "item.*(broken|damaged|faulty)"
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
      "where.*order",
      "track.*order",
      "order.*status",
      "package.*(arrive|coming|delivered)"
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
      "speak.*(agent|human)",
      "talk.*(agent|human)",
      "need.*help.*human",
      "escalate",
      "customer.*service",
      "how.*(contact|reach)",
      "phone.*(number)?",
      "email"
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
      "cancel.*(escalation|request)",
      "stop.*(escalation|request)",
      "never mind"
    ]
  },

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
      "what.*time.*open",
      "when.*close",
      "where.*(store|location)",
      "how.*refund",
      "what.*refund.*policy"
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
      "^faq$",
      "^faqs$",
      "show.*faq",
      "more.*faq",
      "faq.*list"
    ]
  },

  product_lookup: {
    keywords: ["product", "products"],
    regex: [
      "product\\s+\\d+",
      "show\\s+product\\s+\\d+",
      "item\\s+\\d+"
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
      "list.*products",
      "show.*products",
      "all.*products",
      "what.*products",
      "what.*sell",
      "products$"
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
      "^hi\\b",
      "^hello\\b",
      "^hey\\b",
      "thank(s| you)",
      "bye",
      "good\\s*(morning|afternoon|evening)",
      "(lol|haha|hehe)"
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
      "help",
      "info",
      "information",
      "what.*(can|do).*you"
    ]
  }

};
