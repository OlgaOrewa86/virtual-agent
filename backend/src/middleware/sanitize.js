export function sanitizeInput(str) {
  if (typeof str !== "string") return "";

  return str
    .replace(/\s+/g, " ")                     // normalize whitespace
    .replace(/[<>]/g, "")                     // strip HTML tags
    .replace(/[\u0000-\u001F]/g, "")          // remove control chars
    .replace(/[\u200B-\u200D\uFEFF]/g, "")    // remove zero-width chars
    .replace(/[\u2028\u2029]/g, "")           // remove line separators
    .replace(/[\uFFFD]/g, "")                 // remove replacement char
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{S}]/gu, "") // allow symbols (emoji, currency)
    .trim();
}
