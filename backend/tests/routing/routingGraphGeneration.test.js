/**
 * routingGraphGeneration.test.js
 *
 * Tests the routing → Mermaid graph generation:
 * - /routing endpoint loads routing.json
 * - routingToMermaid produces valid Mermaid syntax
 * - graph contains all intents and states
 * - graph contains all edges (intent → next_state)
 */

import request from "supertest";
import app from "../../src/app.js";
import { routingToMermaid } from "../../src/routing/routingToMermaid.js";

describe("Routing Graph Generation (Mermaid)", () => {

  let routing;

  // ---------------------------------------------------------
  // LOAD ROUTING.JSON FROM SERVER
  // ---------------------------------------------------------
  beforeAll(async () => {
    const res = await request(app).get("/routing");
    expect(res.status).toBe(200);
    routing = res.body;
  });

  it("routing.json loads correctly", () => {
    expect(routing).toBeDefined();
    expect(routing.intents).toBeDefined();
    expect(routing.states).toBeDefined();
  });

  // ---------------------------------------------------------
  // MERMAID GRAPH GENERATION
  // ---------------------------------------------------------
  it("routingToMermaid produces a valid Mermaid graph", () => {
    const graph = routingToMermaid(routing);

    expect(typeof graph).toBe("string");
    expect(graph.startsWith("flowchart TD")).toBe(true);

    // Basic Mermaid structure checks
    expect(graph).toContain("user((User))");
    expect(graph).toContain("classifier[[Intent Classifier]]");
  });

  // ---------------------------------------------------------
  // INTENTS APPEAR IN GRAPH
  // ---------------------------------------------------------
  it("graph contains all intent nodes", () => {
    const graph = routingToMermaid(routing);

    for (const intentName in routing.intents) {
      expect(graph).toContain(`${intentName}["${intentName}"]`);
    }
  });

  // ---------------------------------------------------------
  // STATES APPEAR IN GRAPH
  // ---------------------------------------------------------
  it("graph contains all state nodes", () => {
    const graph = routingToMermaid(routing);

    for (const stateName in routing.states) {
      expect(graph).toContain(stateName);
    }
  });

  // ---------------------------------------------------------
  // INTENT → NEXT_STATE EDGES EXIST
  // ---------------------------------------------------------
  it("graph contains all intent → next_state edges", () => {
    const graph = routingToMermaid(routing);

    for (const intentName in routing.intents) {
      const next = routing.intents[intentName].next_state;
      const edge = `${intentName} --> ${next}`;
      expect(graph).toContain(edge);
    }
  });

  // ---------------------------------------------------------
  // STATE TRANSITIONS (onSuccess/onNoMatch/onFailure)
  // ---------------------------------------------------------
  it("graph contains all state transition edges", () => {
    const graph = routingToMermaid(routing);

    for (const stateName in routing.states) {
      const state = routing.states[stateName];

      if (state.onSuccess) {
        expect(graph).toContain(`${stateName} -->|success| ${state.onSuccess}`);
      }

      if (state.onNoMatch) {
        expect(graph).toContain(`${stateName} -->|no match| ${state.onNoMatch}`);
      }

      if (state.onFailure) {
        expect(graph).toContain(`${stateName} -->|failure| ${state.onFailure}`);
      }
    }
  });

  // ---------------------------------------------------------
  // NO EMPTY GRAPH
  // ---------------------------------------------------------
  it("graph contains more than just the header", () => {
    const graph = routingToMermaid(routing);
    const lines = graph.split("\n");
    expect(lines.length).toBeGreaterThan(5);
  });

});
