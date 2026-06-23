// src/flows/supportRequestFlow.js
import { buildResponse } from "../utils/responseBuilder.js";
import startMockTicketService from "../services/mockTicketService.js";

export default async function supportRequestFlow() {
  // Generate a fake ticket ID
  const ticketId = "TCK-" + Math.floor(1000 + Math.random() * 9000);

  // Start mock background service (async)
  startMockTicketService(ticketId);

  // Immediate bot response
  return buildResponse({
    text: "Your support request has been submitted. I’ll notify you when it’s assigned.",
    intent: "support_request",
    source: "api",
    ticketId
  });
}
