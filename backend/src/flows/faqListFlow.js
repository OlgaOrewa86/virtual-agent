// src/flows/faqListFlow.js
import { buildResponse } from "../utils/responseBuilder.js";

export default async function faqListFlow() {
  return buildResponse({
    text: "Here are some common questions I can help with:",
    intent: "faq_list",
    source: "rule",
    list: [
      { title: "What are your opening hours?", value: "hours" },
      { title: "Where are you located?", value: "store location" },
      { title: "What is your return policy?", value: "refund policy" },
      { title: "How long does shipping take?", value: "shipping" },
      { title: "Do you offer international delivery?", value: "international delivery" }
    ]
  });
}
