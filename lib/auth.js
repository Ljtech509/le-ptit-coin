import crypto from "crypto";
const sign = (p) => crypto.createHmac("sha256", process.env.SESSION_SECRET || "dev").update(p).digest("hex");
export function makeToken() { const p = String(Date.now() + 30 * 864e5); return p + "." + sign(p); }
export function checkToken(t) {
  if (!t) return false;
  const [p, s] = t.split(".");
  if (!p || !s) return false;
  const ok = sign(p);
  if (s.length !== ok.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(ok))) return false;
  return Number(p) > Date.now();
}
export function isAdmin(req) {
  const h = req.headers.get("authorization") || "";
  return checkToken(h.startsWith("Bearer ") ? h.slice(7) : req.cookies.get("ptc")?.value);
}
