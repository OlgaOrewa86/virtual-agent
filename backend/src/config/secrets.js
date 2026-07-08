import { SecretsManager } from "@aws-sdk/client-secrets-manager";

const sm = new SecretsManager();

export async function loadSecrets() {
  const secret = await sm.getSecretValue({
    SecretId: "virtual-agent-secrets"
  });

  return JSON.parse(secret.SecretString);
}
