function sanitizeText(value) {
  if (typeof value !== "string") return "";

  return value
    .trim()
    .replace(/[<>]/g, "")        // remove HTML tags
    .replace(/["']/g, "")        // remove quotes
    .replace(/[\u0000-\u001F]/g, ""); // remove control characters
}

module.exports = { sanitizeText };