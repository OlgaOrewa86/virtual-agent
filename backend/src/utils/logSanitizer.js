export function safeLogInput(str) {
  if (typeof str !== "string") return "";

  const cleaned = str
    .replace(/[\u0000-\u001F]/g, "")     // remove control chars
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // remove zero-width chars
    .replace(/\s+/g, " ")                // normalize whitespace
    .trim();

  return cleaned.slice(0, 500);          // truncate to 500 chars
}
