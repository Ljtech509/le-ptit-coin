import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { makeToken } from "@/lib/auth";
import { hashToken, normEmail, validEmail } from "@/lib/users";
import { sendMail } from "@/lib/mail";
export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  const email = normEmail(b.email);
  if (!validEmail(email)) return NextResponse.json({ error: "E-mail invalide." }, { status: 400 });

  // Accès gestion : e-mail admin + mot de passe admin (valeurs dans le fichier .env)
  const adminEmail = normEmail(process.env.ADMIN_EMAIL), adminPw = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPw && email === adminEmail && b.password === adminPw) {
    const res = NextResponse.json({ admin: true });
    res.cookies.set("ptc", makeToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
    return res;
  }

  // Tout autre cas : lien de réinitialisation envoyé par e-mail (si un compte existe)
  await new Promise((r) => setTimeout(r, 600));
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordReset.deleteMany({ where: { userId: user.id } });
    await prisma.passwordReset.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 3600e3) } });
    const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const link = `${base}/compte/reinitialiser?token=${token}`;
    try {
      await sendMail({ to: email, subject: "Réinitialisation de votre mot de passe - Le P’tit Coin",
        text: `Bonjour ${user.name},\n\nPour choisir un nouveau mot de passe, ouvrez ce lien (valable 1 heure) :\n${link}\n\nSi vous n’êtes pas à l’origine de cette demande, ignorez ce message.`,
        html: `<p>Bonjour ${user.name},</p><p>Pour choisir un nouveau mot de passe, cliquez ici (lien valable 1 heure) :</p><p><a href="${link}">Réinitialiser mon mot de passe</a></p><p>Si vous n’êtes pas à l’origine de cette demande, ignorez ce message.</p>` });
    } catch (e) { console.error("Envoi e-mail échoué", e); }
  }
  return NextResponse.json({ sent: true });
}
