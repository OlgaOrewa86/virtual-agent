// src/flows/escalationFlow.js
import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";

export default async function escalationFlow() {
  logger.info("Escalation triggered — handing over to human agent");

  return buildResponse({
    text: "Okay, I’ll connect you with a human agent now. Please hold for a moment.",
    intent: "escalate_to_human",
    source: "rule",

    // escalation card
    card: {
      type: "escalation",
      title: "Connecting you to a human agent",
      message: "A member of our support team will join shortly."
    },

    // optional quick actions
    buttons: [
      { label: "Cancel request", value: "cancel escalation" },
    ]
  });
}
