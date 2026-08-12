export const DEMO_USER = "demo-user";

/**
 * Identifies the caller from the Cognito bearer token.
 *
 * The `sub` claim is read rather than the raw token because the token itself
 * rotates on every refresh - keying on it would make a user's settings appear
 * to reset an hour after they set them. The payload is decoded, not verified:
 * this app has no auth middleware yet, and adding signature checks here would
 * only put them in the controllers that happen to call this.
 *
 * Falls back to a shared demo key when the request carries no token, so the
 * endpoints stay usable against a frontend that isn't signed in.
 */
export function currentUser(req) {
  const header = req.headers.authorization ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return DEMO_USER;
  }

  const payload = token.split(".")[1];
  if (payload) {
    try {
      const claims = JSON.parse(
        Buffer.from(payload, "base64url").toString("utf8")
      );
      if (claims.sub) {
        return claims.sub;
      }
    } catch {
      // Not a JWT (or a malformed one) - fall through to the token itself.
    }
  }

  return token;
}
