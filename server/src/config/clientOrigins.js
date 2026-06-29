import { env } from "./env.js";

const LOCAL_CLIENT_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"];

export function getAllowedClientOrigins() {
  return [...new Set([env.clientOrigin, ...LOCAL_CLIENT_ORIGINS].filter(Boolean))];
}

export function isClientOriginAllowed(origin) {
  return !origin || getAllowedClientOrigins().includes(origin);
}

export function createCorsOriginDelegate() {
  return (origin, callback) => {
    if (isClientOriginAllowed(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS origin is not allowed: ${origin}`));
  };
}
