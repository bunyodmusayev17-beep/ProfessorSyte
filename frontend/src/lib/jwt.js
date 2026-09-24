/** Base64url -> UTF-8 string, tolerating the missing `=` padding in JWTs. */
function base64UrlDecode(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Decode a JWT payload without verifying it — display purposes only. */
export function decodeJwt(token) {
  if (typeof token !== 'string') return null;
  const [, payload] = token.split('.');
  if (!payload) return null;
  try {
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

const NAME_IDENTIFIER_CLAIM =
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/**
 * Pull the fields the UI needs out of the access token. ASP.NET Core emits both
 * the short (`sub`, `email`) and the schema-qualified claim names.
 */
export function readClaims(token) {
  const payload = decodeJwt(token);
  if (!payload) return null;

  return {
    id: payload[NAME_IDENTIFIER_CLAIM] ?? payload.sub ?? null,
    email: payload.email ?? null,
    role: payload[ROLE_CLAIM] ?? payload.role ?? null,
    expiresAt: typeof payload.exp === 'number' ? payload.exp * 1000 : null,
  };
}

/** True when the token is missing or past its `exp` (with a small clock skew allowance). */
export function isTokenExpired(token, skewMs = 5_000) {
  const claims = readClaims(token);
  if (!claims?.expiresAt) return false;
  return claims.expiresAt - skewMs <= Date.now();
}
