// src/config/env.js

export const ENV = {
  node: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  isCI: process.env.CI === "true",

  corsOrigin: process.env.CORS_ALLOWED_ORIGIN || "http://localhost:3000",

};
