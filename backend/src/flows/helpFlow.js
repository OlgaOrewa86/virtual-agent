// src/flows/helpFlow.js
import { buildResponse } from "../utils/responseBuilder.js";

export default async function helpFlow() {
  return buildResponse({
    intent: "help",
    source: "rule",

    card: {
      type: "help",
      title: "How I can help",
      items: [
        { title: "Track an order", value: "track order" },
        { title: "Refunds & returns", value: "refund policy" },
        { title: "Store location", value: "store location" },
        { title: "Talk to a human", value: "talk to human" }
      ]
    }
  });
}
