/**
 * responseBuilder.js
 * Standardised response format for all flows.
 */

export function buildResponse({
  text,
  intent,
  entities = {},
  source = "rule",
  card = null,
  buttons = null,
  list = null,
  image = null,
  product = null 
}) {
  return {
    text,
    intent,
    entities,
    source, // "rule" | "api" | "llm"
    card,   // { type, title, ... }
    buttons, // [ { label, value } ]
    list,   // [ { title, value } ]
    image,  // URL or object
    product, // { id, title, price, category, description, image }
    timestamp: new Date().toISOString()
  };
}
