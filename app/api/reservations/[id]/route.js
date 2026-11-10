import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export async function PATCH(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const b = await req.json(), d = {};
  if (["pending", "confirmed", "cancelled"].includes(b.status)) d.status = b.status;
  if (b.price != null) d.price = Math.max(0, +b.price || 0);
  if (b.deposit != null) d.deposit = Math.max(0, +b.deposit || 0);
  if (b.payMode) d.payMode = String(b.payMode);
  const r = await prisma.reservation.update({ where: { id: params.id }, data: d });
  if (d.status && r.email) {
    const u = await prisma.user.findUnique({ where: { email: r.email.trim().toLowerCase() } });
    const L = { confirmed: "confirmée", cancelled: "annulée", pending: "en attente" };
    if (u) await prisma.notification.create({ data: { userId: u.id, title: "Réservation " + L[d.status], body: `Votre réservation du ${r.date} est ${L[d.status]}.` } });
  }
  return NextResponse.json(r);
}
export async function DELETE(req, { params }) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await prisma.reservation.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
