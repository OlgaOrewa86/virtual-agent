import axios from "axios";

const BASE_URL = "https://fakestoreapi.com/products";

export async function getAllProducts() {
  const res = await axios.get(BASE_URL);
  return res.data; // array of products
}

export async function getProductById(id) {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data; // single product
}
