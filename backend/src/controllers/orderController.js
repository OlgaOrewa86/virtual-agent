import orderApi from "../api/orderApi.js";

export async function orderController(req, res) {
  try {
    const result = await orderApi(req, res);
    return result;
  } catch {
    return res.status(500).json({ error: "Order lookup failed" });
  }
}
