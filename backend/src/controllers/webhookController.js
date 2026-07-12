import { addEvent } from "../store/eventStore.js";

export function webhookController(req, res) {
  const { event, ticketId, agent } = req.webhookData;

  addEvent({
    event,
    ticketId,
    agent,
    sender: "agent",
    text: `Your support ticket ${ticketId} has been assigned to ${agent}.`
  });

  res.status(200).json({ status: "ok" });
}
