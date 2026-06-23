import { addEvent } from "../store/eventStore.js";

export default function pushBotMessage(text) {
  addEvent({
    sender: "agent",
    text,
    time: new Date().toISOString()
  });
}
