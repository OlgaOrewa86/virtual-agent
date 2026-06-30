import fs from "fs";
import path from "path";

export function buildOrderPrompt(userMessage, orderContext = {}) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "prompts", "orderPrompt.txt"),
    "utf8"
  );

  const contextString = Object.keys(orderContext).length > 0
    ? Object.entries(orderContext)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join("\n")
    : "(no order context available)";

  return template
    .replace("{{userMessage}}", userMessage)
    .replace("{{orderContext}}", contextString);
}
