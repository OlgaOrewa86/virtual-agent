// src/services/mockTicketService.js
import axios from "axios";
import logger from "../utils/logger.js";

const AGENTS = ["Sarah", "John", "Emily", "Michael", "Ava"];
const WEBHOOK_URL = "http://localhost:3001/webhook/support-update";

// Validate ticket ID (TCK-1000–9999)
function validateTicketId(id) {
  return /^TCK-\d{4}$/.test(id);
}

export default function startMockTicketService(ticketId) {
  if (!validateTicketId(ticketId)) {
    logger.warn(`Mock ticket service received invalid ticketId: ${ticketId}`);
    return;
  }

  logger.info(`Mock ticket service started for ${ticketId}`);

  const timeoutMs = 5000;

  setTimeout(async () => {
    try {
      const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];

      await axios.post(WEBHOOK_URL, {
        event: "ticket.assigned",
        ticketId,
        agent
      });

      logger.info(`Mock webhook sent for ticket ${ticketId} (assigned to ${agent})`);
    } catch (err) {
      logger.error(`Mock service failed for ${ticketId}: ${err.message}`);
    }
  }, timeoutMs);
}
