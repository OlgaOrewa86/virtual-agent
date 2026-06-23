// src/services/mockTicketService.js
import axios from "axios";
import logger from "../utils/logger.js";

export default function startMockTicketService(ticketId) {
  logger.info(`Mock ticket service started for ${ticketId}`);

  // Simulate async external system (Zendesk, Salesforce, etc.)
  setTimeout(async () => {
    try {
      await axios.post("http://localhost:3001/webhook/support-update", {
        event: "ticket.assigned",
        ticketId,
        agent: "Sarah"
      });

      logger.info(`Mock webhook sent for ticket ${ticketId}`);
    } catch (err) {
      logger.error("Mock service failed:", err.message);
    }
  }, 5000);
}
