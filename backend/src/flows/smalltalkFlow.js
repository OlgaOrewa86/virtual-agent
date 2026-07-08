// src/flows/smalltalkFlow.js
import { buildResponse } from "../utils/responseBuilder.js";

const GREETINGS = ["hi", "hello", "hey", "morning", "afternoon", "evening"];
const THANKS = ["thanks", "thank you", "thx"];
const GOODBYES = ["bye", "goodbye"];
const LAUGHS = ["lol", "haha", "hehe"];

// Normalize user text safely
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // remove punctuation
    .trim();
}

// Check if any phrase appears as a standalone word/phrase
function containsPhrase(text, phrases) {
  return phrases.some(p => text.includes(p));
}

export default async function smalltalkFlow(message) {
  const text = normalize(message);

  // Greeting
  if (containsPhrase(text, GREETINGS)) {
    return buildResponse({
      text: "Hi there! How can I help you today?",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Thanks
  if (containsPhrase(text, THANKS)) {
    return buildResponse({
      text: "You're welcome! Happy to help.",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Goodbye
  if (containsPhrase(text, GOODBYES)) {
    return buildResponse({
      text: "Goodbye! Have a great day.",
      intent: "smalltalk",
      source: "rule"
    });
  }

  // Laughs
  if (containsPhrase(text, LAUGHS)) {
    return buildResponse({
      text: "😄",
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
