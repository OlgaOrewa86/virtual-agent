// src/flows/supportRequestFlow.js
import { buildResponse } from "../utils/responseBuilder.js";
import startMockTicketService from "../services/mockTicketService.js";

const TICKET_PREFIX = "TCK-";

// Generate safe, bounded ticket ID
function generateTicketId() {
  const num = Math.floor(1000 + Math.random() * 9000); // 1000–9999
  return `${TICKET_PREFIX}${num}`;
}

export default async function supportRequestFlow() {
  const ticketId = generateTicketId();

  try {
    // Start background mock service safely
    startMockTicketService(ticketId);
  } catch (err) {
    // Log but do not expose internal errors to the user
    console.error("Mock ticket service failed:", err);
  }

  return buildResponse({
    text: `Your support ticket ${ticketId} has been created. I’ll notify you when it’s assigned.`,
    intent: "support_request",
    source: "api",
    ticketId,
    startPolling: true
  });
}
