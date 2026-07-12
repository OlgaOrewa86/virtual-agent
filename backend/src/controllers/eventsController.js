import { getEvents, clearEvents } from "../store/eventStore.js";

export function eventsController(req, res) {
  const events = getEvents();

  if (events.length > 0) {
    clearEvents();
    return res.json({ events, done: true });
  }

  return res.json({ events: [], done: false });
}
