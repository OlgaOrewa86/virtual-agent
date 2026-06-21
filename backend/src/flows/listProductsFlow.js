import { getAllProducts } from "../services/productService.js";
import { buildResponse } from "../utils/responseBuilder.js";

export default async function listProductsFlow() {
  const products = await getAllProducts();

  const list = products.map(p => ({
    title: `${p.id}. ${p.title}`,
    value: `product ${p.id}`
  }));

  return buildResponse({
    text: null,
    intent: "list_products_success",
    source: "api",
    list,
    buttons: [
      { label: "Show product 1", value: "product 1" },
      { label: "Show product 2", value: "product 2" }
    ]
  });
}
