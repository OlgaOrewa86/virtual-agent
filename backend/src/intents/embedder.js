// src/intents/embedder.js
import { pipeline } from "@xenova/transformers";

// Lazy‑loaded embedder instance
let embedder = null;

/**
 * Loads the MiniLM embedding model once (singleton).
 */
export async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return embedder;
}

/**
 * Returns a semantic embedding vector for a given text.
 */
export async function embed(text) {
  if (!text || typeof text !== "string") {
    return [];
  }

  const model = await getEmbedder();
  const output = await model(text);

  // output shape: [1][tokens][768]
  // We take the first token embedding (CLS token)
  return output[0][0];
}