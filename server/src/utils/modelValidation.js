export function requireText(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

export function optionalText(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

export function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

export function textSearchFilter(fields, query) {
  if (!query) {
    return {};
  }

  const regex = new RegExp(String(query).trim(), "i");

  return {
    $or: fields.map((field) => ({ [field]: regex }))
  };
}

