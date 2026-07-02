// src/intents/embedder.js
import { pipeline } from "@xenova/transformers";

// Lazy‑loaded embedder instance
let embedder = null;

/**
 * Loads the MiniLM embedding model once (singleton).
 */
export async function getEmbedder() {
  if (!embedder) {
    try {
      embedder = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    } catch (err) {
      console.error("Failed to load embedder model:", err);
      embedder = null; // ensure we don't cache a broken instance
    }
  }
  return embedder;
}

/**
 * Returns a semantic embedding vector for a given text.
 * Always safe: never throws, always returns [] on failure.
 */
export async function embed(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  let model;
  try {
    model = await getEmbedder();
    if (!model) {
      return []; // model failed to load
    }
  } catch (err) {
    console.error("Embedder initialization error:", err);
    return [];
  }

  try {
    const output = await model(text);
    // output shape: [1][tokens][768]
    return output[0][0];
  } catch (err) {
    console.error("Embedder error:", err);
    return []; // semantic unavailable
  }
}
