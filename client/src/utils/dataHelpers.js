export function indexById(items) {
  return Object.fromEntries((items || []).map((item) => [item.id, item]));
}

export function splitCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
