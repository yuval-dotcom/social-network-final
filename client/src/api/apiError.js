export function getApiErrorMessage(error, fallback) {
  return error?.responseJSON?.message || error?.message || fallback;
}
