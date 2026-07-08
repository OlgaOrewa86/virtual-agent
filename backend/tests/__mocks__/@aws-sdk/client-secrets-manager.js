// Mock for AWS SDK v3 Secrets Manager

export class SecretsManagerClient {
  send() {
    return Promise.resolve({
      SecretString: JSON.stringify({
        OPENAI_API_KEY: "test-key",
        OTHER_SECRET: "value"
      })
    });
  }
}

export class GetSecretValueCommand {
  constructor() {}
}

// Some code incorrectly imports { SecretsManager } (AWS SDK v2 style)
// Provide a dummy class so Jest doesn't crash.
export class SecretsManager {
  constructor() {}
  getSecretValue() {
    return Promise.resolve({
      SecretString: JSON.stringify({
        OPENAI_API_KEY: "test-key"
      })
    });
  }
}
