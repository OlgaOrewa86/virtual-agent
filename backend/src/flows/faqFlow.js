// src/flows/faqFlow.js
import fs from "fs";
import path from "path";
import levenshtein from "fast-levenshtein";
import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";

function fuzzyMatch(a, b) {
  return levenshtein.get(a, b) <= 2;
}

function getRelatedFAQs(match, faqData) {
  if (!match.related) return [];

  return faqData
    .filter((item) =>
      match.related.some((rel) =>
        item.keywords.includes(rel)
      )
    )
    .map((item) => ({
      title: item.question,
      value: item.keywords[0] // first keyword triggers the FAQ
    }));
}


const faqPath = path.resolve("knowledge/faq.json");

let faqData = [];

try {
  const raw = fs.readFileSync(faqPath, "utf-8");
  faqData = JSON.parse(raw);
  logger.info("FAQ data loaded successfully");
} catch (err) {
  logger.error("Failed to load FAQ data:", err);
}

export default async function faqFlow(userMessage) {
  const text = userMessage.toLowerCase();
  const words = text.split(/\s+/); // split into words

  const match = faqData.find((item) =>
    item.keywords &&
    item.keywords.some((k) => {
      const keyword = k.toLowerCase();

      // 1. Whole‑word match (strong)
      if (words.includes(keyword)) return true;

      // 2. Fuzzy match only for meaningful words
      return words.some(
        (w) =>
          w.length > 4 && keyword.length > 4 && levenshtein.get(w, keyword) <= 1
      );
    })
  );


  if (match) {
    const relatedFAQs = getRelatedFAQs(match, faqData);

    return buildResponse({
      text: match.answer,
      intent: "faq",
      entities: { keywords: match.keywords }, 
      source: "rule",

      //Grounding data for fallback
      matches: [match],

      card: {
        type: "faq",
        title: match.question,
        answer: match.answer,
        related: relatedFAQs 
      },

      buttons: [
        { label: "More FAQs", value: "show faqs" },
        { label: "Talk to support", value: "talk to human" }
      ]
    });
  }

  return buildResponse({
    text: "I'm not sure about that. Let me think…",
    intent: "faq_no_match",
    source: "rule",

   // Empty grounding array
    matches: [],

    buttons: [
      { label: "Show FAQs", value: "show faqs" },
      { label: "Talk to support", value: "talk to human" }
    ]
  });
}
