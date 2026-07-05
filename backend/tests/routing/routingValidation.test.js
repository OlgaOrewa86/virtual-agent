/**
 * routingValidation.test.js
 *
 * Validates the structure of routing.json:
 * - all intents have next_state
 * - next_state exists in states
 * - patterns are well-formed
 * - no orphan states or orphan intents
 */

import routing from "../../src/routing/routing.json" with { type: "json" };



describe("Routing JSON Validation", () => {

  const { intents, states } = routing;

  // ---------------------------------------------------------
  // BASIC STRUCTURE
  // ---------------------------------------------------------
  it("routing.json contains intents and states", () => {
    expect(intents).toBeDefined();
    expect(states).toBeDefined();
    expect(typeof intents).toBe("object");
    expect(typeof states).toBe("object");
  });

  // ---------------------------------------------------------
  // INTENT → NEXT_STATE VALIDATION
  // ---------------------------------------------------------
  it("every intent has a valid next_state", () => {
    for (const intentName in intents) {
      const intent = intents[intentName];

      expect(intent.next_state).toBeDefined();
      expect(typeof intent.next_state).toBe("string");

      const stateExists = Boolean(states[intent.next_state]);
      expect(stateExists).toBe(true);
    }
  });

  // ---------------------------------------------------------
  // PATTERN VALIDATION
  // ---------------------------------------------------------
  it("every intent has valid keyword and regex patterns", () => {
    for (const intentName in intents) {
      const { patterns } = intents[intentName];

      // Some intents (e.g., fallback) legitimately have no patterns
      if (!patterns) continue;

      expect(Array.isArray(patterns.keywords)).toBe(true);
      expect(Array.isArray(patterns.regex)).toBe(true);

      // Keywords must be strings
      patterns.keywords.forEach((kw) => {
        expect(typeof kw).toBe("string");
      });

      // Regex must be valid strings convertible to RegExp
      patterns.regex.forEach((pattern) => {
        expect(typeof pattern).toBe("string");
        expect(() => new RegExp(pattern)).not.toThrow();
      });
    }
  });


  // ---------------------------------------------------------
  // STATE VALIDATION
  // ---------------------------------------------------------
  it("every state is referenced by at least one intent", () => {
    const referencedStates = new Set(
      Object.values(intents).map((i) => i.next_state)
    );

    for (const stateName in states) {
      const isReferenced = referencedStates.has(stateName);
      expect(isReferenced).toBe(true);
    }
  });

  // ---------------------------------------------------------
  // STATE TRANSITION VALIDATION
  // ---------------------------------------------------------
  it("state transitions (onSuccess/onNoMatch/onFailure) reference valid states", () => {
    for (const stateName in states) {
      const state = states[stateName];

      ["onSuccess", "onNoMatch", "onFailure"].forEach((key) => {
        if (state[key]) {
          const target = state[key];
          const exists = Boolean(states[target]);
          expect(exists).toBe(true);
        }
      });
    }
  });

  // ---------------------------------------------------------
  // NO ORPHAN INTENTS
  // ---------------------------------------------------------
  it("no intent is missing patterns or next_state", () => {
    for (const intentName in intents) {
      const intent = intents[intentName];

      expect(intent.description).toBeDefined();
      if (intent.patterns) {
          expect(intent.patterns.keywords).toBeDefined();
          expect(intent.patterns.regex).toBeDefined();
      }


      expect(intent.next_state).toBeDefined();
    }
  });

  // ---------------------------------------------------------
  // NO EMPTY STATES
  // ---------------------------------------------------------
  it("states are valid objects (even if empty)", () => {
    for (const stateName in states) {
      const state = states[stateName];
      expect(typeof state).toBe("object");
    }
  });

});
