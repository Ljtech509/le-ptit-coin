import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, hashToken, setUserCookie } from "@/lib/users";
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const pw = String(b.password || "");
  if (pw.length < 6) return NextResponse.json({ error: "Mot de passe : 6 caractères minimum." }, { status: 400 });
  const r = await prisma.passwordReset.findUnique({ where: { tokenHash: hashToken(String(b.token || "")) } });
  if (!r || r.expiresAt < new Date()) return NextResponse.json({ error: "Lien invalide ou expiré. Refaites une demande." }, { status: 400 });
  await prisma.user.update({ where: { id: r.userId }, data: { passwordHash: hashPassword(pw) } });
  await prisma.passwordReset.deleteMany({ where: { userId: r.userId } });
  await prisma.notification.create({ data: { userId: r.userId, title: "Mot de passe modifié", body: "Votre mot de passe vient d’être changé." } });
  const res = NextResponse.json({ ok: true });
  setUserCookie(res, r.userId);
  return res;
}
