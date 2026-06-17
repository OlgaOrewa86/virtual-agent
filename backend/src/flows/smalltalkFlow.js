// src/flows/smalltalkFlow.js
import { buildResponse } from "../utils/responseBuilder.js";

export default async function smalltalkFlow(message) {
  const text = message.toLowerCase();

  // Greeting
  if (text.includes("hi") || text.includes("hello") || text.includes("hey")) {
    return buildResponse({
      text: "Hi there! How can I help you today?",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Thanks
  if (text.includes("thanks") || text.includes("thank you")) {
    return buildResponse({
      text: "You're welcome! Happy to help.",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Goodbye
  if (text.includes("bye")) {
    return buildResponse({
      text: "Goodbye! Have a great day.",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Default smalltalk
  return buildResponse({
    text: "😊",
    intent: "smalltalk",
    source: "rule"
  });
}
