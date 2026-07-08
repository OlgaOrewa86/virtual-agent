export function sanitizeProduct(p) {
  const safeId = String(p.id)
    .replace(/[^\w-]/g, "")      // allow only letters, numbers, underscore, dash
    .slice(0, 50);               // prevent huge IDs

  const safeTitle = String(p.title)
    .replace(/[\u0000-\u001F]/g, "")   // remove control chars
    .replace(/[<>]/g, "")              // strip HTML tags
    .replace(/\s+/g, " ")              // normalize whitespace
    .trim()
    .slice(0, 200);                    // prevent huge titles

  return { id: safeId, title: safeTitle };
}
