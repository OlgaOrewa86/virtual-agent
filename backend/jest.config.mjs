// backend/jest.config.mjs
export default {
  setupFilesAfterEnv: ["<rootDir>/tests/setup.mjs"],
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^@aws-sdk/client-secrets-manager$":
      "<rootDir>/tests/__mocks__/@aws-sdk/client-secrets-manager.js"
  }
};
