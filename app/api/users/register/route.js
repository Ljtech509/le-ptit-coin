import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, setUserCookie, normEmail, validEmail } from "@/lib/users";
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const name = String(b.name || "").trim().slice(0, 80), email = normEmail(b.email), pw = String(b.password || "");
  if (!name || !validEmail(email)) return NextResponse.json({ error: "Nom ou e-mail invalide." }, { status: 400 });
  if (pw.length < 6) return NextResponse.json({ error: "Mot de passe : 6 caractères minimum." }, { status: 400 });
  if (email === normEmail(process.env.ADMIN_EMAIL) || (await prisma.user.findUnique({ where: { email } })))
    return NextResponse.json({ error: "Un compte existe déjà avec cet e-mail." }, { status: 409 });
  const u = await prisma.user.create({ data: { name, email, passwordHash: hashPassword(pw),
    notifications: { create: { title: "Bienvenue au P’tit Coin", body: "Votre compte est créé. Vous recevrez ici les nouvelles de vos réservations." } } } });
  const res = NextResponse.json({ ok: true });
  setUserCookie(res, u.id);
  return res;
}
