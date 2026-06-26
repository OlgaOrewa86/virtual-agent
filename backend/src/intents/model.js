// src/intents/model.js
import intents from "./intents.json" with { type: "json" };

import { embed } from "./embedder.js";

let intentVectors = null;

/**
 * Loads and computes averaged embedding vectors for each intent.
 * This runs once and caches the result.
 */
export async function loadIntentVectors() {
  if (intentVectors) return intentVectors;

  intentVectors = {};

  for (const item of intents) {
    const vectors = [];

    // Embed each example sentence
    for (const example of item.examples) {
      const vec = await embed(example);
      if (vec.length > 0) {
        vectors.push(vec);
      }
    }

    // Average all example vectors → one vector per intent
    if (vectors.length === 0) {
      console.warn(`No vectors generated for intent: ${item.intent}`);
      continue;
    }

    
    const avg = vectors[0].map((_, i) =>
      vectors.reduce((sum, v) => sum + v[i], 0) / vectors.length
    );

    intentVectors[item.intent] = avg;
  }

  return intentVectors;
}
