// src/config/webhookSecrets.js
import { loadSecrets } from "./secrets.js";

export async function initWebhookSecret(ENV) {
  if (ENV.isCI || ENV.isTest) {
    return {
      webhookSecret: "test-secret",
      secretsReady: Promise.resolve()
    };
  }

  const secretsReady = loadSecrets().then((secrets) => secrets.WEBHOOK_SECRET);

  return {
    webhookSecret: null,
    secretsReady
  };
}
