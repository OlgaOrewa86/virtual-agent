// src/flows/cancelEscalationFlow.js
import { buildResponse } from "../utils/responseBuilder.js";

export default async function cancelEscalationFlow() {
  return buildResponse({
    text: "Okay, I’ve cancelled your request to speak with a human agent.",
    intent: "cancel_escalation",
    source: "rule"
  });
}
