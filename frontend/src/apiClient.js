// src/apiClient.js

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// Enforce HTTPS in production builds
if (process.env.NODE_ENV === "production") {
  if (!API_BASE.startsWith("https://")) {
    throw new Error("API base URL must use HTTPS in production.");
  }
}

// --- Shape validators ---
function safeString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function safeArray(value) {
  return Array.isArray(value) ? value : null;
}

function safeObject(value) {
  return value && typeof value === "object" ? value : null;
}

// --- Defensive fetch wrapper ---
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    return null; // safe fallback
  }
}

// --- API methods ---
export async function sendAgentMessage(message) {
  const data = await safeFetch(`${API_BASE}/agent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!data) {
    return {
      text: "Error contacting server.",
      startPolling: false,
      card: null,
      buttons: null,
      list: null,
      image: null,
      product: null,
    };
  }

  return {
    text: safeString(data.text, "Sorry, something went wrong."),
    startPolling: Boolean(data.startPolling),
    ticketId: safeString(data.ticketId, null),
    agent: safeString(data.agent, null),
    card: safeObject(data.card),
    buttons: safeArray(data.buttons),
    list: safeArray(data.list),
    image: safeString(data.image, null),
    product: safeObject(data.product),
  };
}

export async function pollEvents() {
  const data = await safeFetch(`${API_BASE}/events`);

  if (!data || !safeArray(data.events)) {
    return [];
  }

  return data.events.map(evt => ({
    sender: safeString(evt.sender, "agent"),
    text: safeString(evt.text, ""),
  }));
}
