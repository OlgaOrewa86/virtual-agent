// src/flows/productFlow.js
import { getProductById } from "../services/productService.js";
import { buildResponse } from "../utils/responseBuilder.js";

const MAX_PRODUCTS = 20;

// --- Extract product ID (1–20) ---
function extractProductId(text) {
  const match = text.match(/\b\d{1,3}\b/);
  return match ? Number(match[0]) : null;
}

// --- Validate product ID strictly ---
function validateProductId(id) {
  return Number.isInteger(id) && id >= 1 && id <= MAX_PRODUCTS;
}

export default async function productFlow(userMessage) {
  const id = extractProductId(userMessage);

  if (!id || !validateProductId(id)) {
    return buildResponse({
      text: `Please provide a valid product ID between 1 and ${MAX_PRODUCTS}.`,
      intent: "product_lookup_missing_id",
      source: "rule",
      buttons: [
        { label: "List products", value: "list products" }
      ]
    });
  }

  try {
    const product = await getProductById(id);

    // Safe random ID generation
    const randomId = Math.floor(Math.random() * MAX_PRODUCTS) + 1;

    return buildResponse({
      text: null,
      intent: "product_lookup_success",
      source: "api",
      product,
      buttons: [
        { label: "Show another product", value: `product ${randomId}` },
        { label: "List products", value: "list products" }
      ]
    });
  } catch {
    return buildResponse({
      text: `I couldn't find product ${id}. Try another ID between 1 and ${MAX_PRODUCTS}.`,
      intent: "product_lookup_not_found",
      source: "api",
      buttons: [
        { label: "List products", value: "list products" }
      ]
    });
  }
}
