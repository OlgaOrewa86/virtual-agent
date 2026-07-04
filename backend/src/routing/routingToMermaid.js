// src/routing/routingToMermaid.js

/**
 * Convert routing JSON into a Mermaid flowchart (TD) string.
 *
 * Expected routing shape:
 * {
 *   "intents": {
 *     "faq": { "next_state": "faqFlow" },
 *     "order_status": { "next_state": "orderFlow" },
 *     ...
 *   },
 *   "states": {
 *     "faqFlow": { "onSuccess": "faqFlow", "onNoMatch": "fallbackFlow" },
 *     ...
 *   }
 * }
 */
export function routingToMermaid(routing) {
  let graph = "flowchart TD\n";

  // Core nodes
  graph += "  user((User))\n";
  graph += "  classifier[[Intent Classifier]]\n";
  graph += "  user --> classifier\n";

  // Intents → flows
  if (routing.intents) {
    for (const intentName in routing.intents) {
      const intent = routing.intents[intentName];
      const next = intent.next_state || "fallbackFlow";

      // Intent node
      graph += `  classifier --> ${intentName}["${intentName}"]\n`;
      // Flow node
      graph += `  ${intentName} --> ${next}\n`;
    }
  }

  // State-level branching (e.g. faqFlow onSuccess/onNoMatch)
  if (routing.states) {
    for (const stateName in routing.states) {
      const state = routing.states[stateName];

      if (state.onSuccess) {
        graph += `  ${stateName} -->|success| ${state.onSuccess}\n`;
      }
      if (state.onNoMatch) {
        graph += `  ${stateName} -->|no match| ${state.onNoMatch}\n`;
      }
      if (state.onFailure) {
        graph += `  ${stateName} -->|failure| ${state.onFailure}\n`;
      }
    }
  }

  return graph;
}
