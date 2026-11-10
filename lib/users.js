import crypto from "crypto";
const sign = (p) => crypto.createHmac("sha256", process.env.SESSION_SECRET || "dev").update(p).digest("hex");
const same = (a, b) => a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));

export function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  return salt + ":" + crypto.scryptSync(pw, salt, 64).toString("hex");
}
export function verifyPassword(pw, stored) {
  const [salt, h] = String(stored).split(":");
  if (!salt || !h) return false;
  return same(crypto.scryptSync(pw, salt, 64).toString("hex"), h);
}
export function makeUserToken(id) { const p = id + "." + (Date.now() + 30 * 864e5); return p + "." + sign("u:" + p); }
export function userIdFromReq(req) {
  const parts = (req.cookies.get("ptu")?.value || "").split(".");
  if (parts.length !== 3) return null;
  const [id, exp, sig] = parts;
  if (!same(sig, sign("u:" + id + "." + exp))) return null;
  return Number(exp) > Date.now() ? id : null;
}
export function setUserCookie(res, id) {
  res.cookies.set("ptu", makeUserToken(id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
}
export const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");
export const normEmail = (e) => String(e || "").trim().toLowerCase();
export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
