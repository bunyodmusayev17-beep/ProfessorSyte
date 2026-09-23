export function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getUserIdFromToken(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;
  return (
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    payload.sub ||
    null
  );
}
