function sanitizeText(value) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "");
}

module.exports = { sanitizeText };
