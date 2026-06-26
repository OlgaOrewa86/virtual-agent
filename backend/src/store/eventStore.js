// Simple in-memory event store
let events = [];

export function addEvent(event) {
  events.push(event);
}

export function getEvents() {
  return events;
}

export function clearEvents() {
  events = [];
}
console.log("EVENT STORE LOADED", Math.random());

