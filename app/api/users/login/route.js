import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, setUserCookie, normEmail } from "@/lib/users";
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const u = await prisma.user.findUnique({ where: { email: normEmail(b.email) } });
  if (!u || !verifyPassword(String(b.password || ""), u.passwordHash)) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "E-mail ou mot de passe incorrect." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  setUserCookie(res, u.id);
  return res;
}
