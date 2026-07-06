// src/intents/intentClassifier.js
import patterns from "./patterns.js";
import { embed } from "./embedder.js";
import { loadIntentVectors } from "./model.js";
import { cosine } from "./similarity.js";
import { logNLU } from "./nluLogger.js";

// -------------------------------------------------------------
// 1. RULE SCORING
// -------------------------------------------------------------
function scoreRules(text) {
  const scores = {};
  for (const intent in patterns) scores[intent] = 0;

  // Order number override
  const orderNumberRegex = /\b\d{5,10}\b/;
  if (orderNumberRegex.test(text)) {
    return { intent: "order_status", score: 5, override: true };
  }

  // Keyword scoring
  for (const intent in patterns) {
    const { keywords } = patterns[intent];

    for (const word of keywords) {
      const wholeWord = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");

      // Exact match
      if (text === word) {
        scores[intent] = intent === "support_request"
          ? Math.max(scores[intent], 1)
          : Math.max(scores[intent], 4);
      }

      // Whole word match
      if (wholeWord.test(text)) {
        scores[intent] = intent === "support_request"
          ? Math.max(scores[intent], 1)
          : Math.max(scores[intent], 3);
      }
    }
  }

  // Regex scoring
  for (const intent in patterns) {
    const { regex } = patterns[intent];

    for (const pattern of regex) {
      const re = new RegExp(pattern, "i");
        if (re.test(text)) {

          scores[intent] = intent === "support_request"
            ? Math.max(scores[intent], 2)
            : Math.max(scores[intent], 5);
      }
    }
  }

  // Best rule intent
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestIntent, bestScore] = sorted[0];

  return { intent: bestIntent, score: bestScore, override: false };
}

// -------------------------------------------------------------
// 2. SEMANTIC SCORING
// -------------------------------------------------------------
async function scoreSemantic(text) {
  const userVec = await embed(text);

  // Semantic unavailable
  if (!userVec || userVec.length === 0) {
    return { intent: null, score: 0, sim: 0, available: false };
  }

  const intentVectors = await loadIntentVectors();

  let bestIntent = "fallback";
  let bestSim = -1;

  for (const intent in intentVectors) {
    const sim = cosine(userVec, intentVectors[intent]);
    if (sim > bestSim) {
      bestSim = sim;
      bestIntent = intent;
    }
  }

  let score = 0;
  if (bestSim > 0.80) score = 5;
  else if (bestSim > 0.65) score = 4;
  else if (bestSim > 0.50) score = 3;
  else if (bestSim > 0.35) score = 2;
  else if (bestSim > 0.20) score = 1;

  return { intent: bestIntent, score, sim: bestSim, available: true };
}

// -------------------------------------------------------------
// 3. DECISION LOGIC
// -------------------------------------------------------------
function decideIntent(rule, semantic) {
  // Strong rule-based override
  if (rule.override || rule.score >= 4) {
    return { intent: rule.intent, confidence: rule.score };
  }

  // Semantic unavailable
  if (!semantic.available) {
    if (rule.score === 0) {
      return { intent: "fallback", confidence: 0 };
    }
    return { intent: rule.intent, confidence: rule.score };
  }

  // Hybrid logic
  if (semantic.score > rule.score) {
    return { intent: semantic.intent, confidence: semantic.score };
  }

  return { intent: rule.intent, confidence: rule.score };
}

// -------------------------------------------------------------
// 4. MAIN CLASSIFIER
// -------------------------------------------------------------
export default async function classifyIntent(message) {
  if (!message || typeof message !== "string") {
    return { intent: "fallback", confidence: 0 };
  }

  const text = message.toLowerCase().trim();

  const rule = scoreRules(text);
  const semantic = await scoreSemantic(text);
  const decision = decideIntent(rule, semantic);

  logNLU({
    message,
    ruleIntent: rule.intent,
    ruleScore: rule.score,
    semanticIntent: semantic.intent,
    semanticScore: semantic.sim,
    finalIntent: decision.intent,
    finalConfidence: decision.confidence
  });

  return decision;
}

// -------------------------------------------------------------
// Utility
// -------------------------------------------------------------
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
