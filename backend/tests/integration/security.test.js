// tests/integration/security.test.js
import { jest } from "@jest/globals";
import request from "supertest";

// --- Mock rate limiting so tests don't get 429 ---
jest.mock("express-rate-limit", () => {
  return () => (req, res, next) => next();
});

// Import app AFTER mocks
import app from "../../src/app.js";

describe("Security Tests", () => {
  // --- CORS ---
  describe("CORS enforcement", () => {
    test("rejects requests from disallowed origins", async () => {
      const res = await request(app)
        .get("/health")
        .set("Origin", "http://evil.com");

      expect(res.headers["access-control-allow-origin"]).not.toBe("http://evil.com");
    });

    test("allows requests from allowed origin", async () => {
      const allowed = process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000";

      const res = await request(app)
        .get("/health")
        .set("Origin", allowed);

      expect(res.headers["access-control-allow-origin"]).toBe(allowed);
    });
  });

  // --- Input Validation ---
  describe("Input validation failures", () => {
    test("rejects missing message field", async () => {
      const res = await request(app)
        .post("/agent")
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid input: expected string, received undefined");
    });

    test("rejects wrong type for message", async () => {
      const res = await request(app)
        .post("/agent")
        .send({ message: 12345 });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Invalid input: expected string, received number");
    });
  });




});
