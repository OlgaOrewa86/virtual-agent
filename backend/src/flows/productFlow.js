// src/flows/productFlow.js
import { getProductById } from "../services/productService.js";
import { buildResponse } from "../utils/responseBuilder.js";

function extractProductId(text) {
  const match = text.match(/\b(\d+)\b/);
  return match ? Number(match[1]) : null;
}

export default async function productFlow(userMessage) {
  const id = extractProductId(userMessage);

  if (!id) {
    return buildResponse({
      text: "Please provide a product ID, for example: 'product 1'.",
      intent: "product_lookup_missing_id",
      source: "rule",
      buttons: [
        { label: "List products", value: "list products" }
      ]
    });
  }

  try {
    const product = await getProductById(id);
    const randomId = Math.floor(Math.random() * 20) + 1;

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
  } catch (err) {
    return buildResponse({
      text: "I couldn't find that product. Try another ID.",
      intent: "product_lookup_not_found",
      source: "api",
      buttons: [
        { label: "List products", value: "list products" }
      ]
    });
  }
}
