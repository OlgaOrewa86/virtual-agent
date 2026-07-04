// src/routing/debugPanel.js
/* global document, fetch , setInterval */

export class DebugPanel {
  constructor(containerId = "debug-panel") {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn("DebugPanel: container not found:", containerId);
      return;
    }

    this.startPolling();
  }

  startPolling() {
    setInterval(() => this.fetchEvents(), 1000);
  }

  async fetchEvents() {
    try {
      const res = await fetch("http://localhost:3001/events");
      const data = await res.json();

      if (data.done && data.events.length > 0) {
        this.render(data.events);
      }
    } catch (err) {
      console.error("DebugPanel error:", err);
    }
  }

  render(events) {
    const html = events
      .map(ev => {
        return `
          <div class="debug-item">
            <div class="debug-title">${ev.event}</div>
            <div><strong>Message:</strong> ${ev.message || "(none)"}</div>
            <div><strong>Rule Intent:</strong> ${ev.ruleIntent}</div>
            <div><strong>Rule Score:</strong> ${ev.ruleScore}</div>
            <div><strong>Semantic Intent:</strong> ${ev.semanticIntent}</div>
            <div><strong>Semantic Score:</strong> ${ev.semanticScore}</div>
            <div><strong>Final Intent:</strong> ${ev.finalIntent}</div>
            <div><strong>Confidence:</strong> ${ev.finalConfidence}</div>
          </div>
        `;
      })
      .join("");

    this.container.innerHTML = html;
  }
}
