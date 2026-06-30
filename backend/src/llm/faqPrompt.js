import fs from "fs";
import path from "path";

export function buildFaqPrompt(userMessage, faqMatches = []) {
  const template = fs.readFileSync(
    path.join(process.cwd(), "prompts", "faqPrompt.txt"),
    "utf8"
  );

  const faqEntries =
    faqMatches.length > 0
      ? faqMatches.map(f => `- Q: ${f.question}\n  A: ${f.answer}`).join("\n")
      : "(none found)";

  return template
    .replace("{{userMessage}}", userMessage)
    .replace("{{faqEntries}}", faqEntries);
}
