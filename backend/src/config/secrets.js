
export async function loadSecrets() {
  return {
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SHIP24_API_KEY: process.env.SHIP24_API_KEY
  };
}
