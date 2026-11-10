import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
const TYPES = ["piscine", "reunion", "anniversaire", "autre"];
export async function POST(req) {
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.whatsapp || !b.date || !TYPES.includes(b.type))
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  const r = await prisma.reservation.create({ data: {
    name: String(b.name).slice(0, 120), whatsapp: String(b.whatsapp).slice(0, 40),
    phone: b.phone || null, email: b.email || null, type: b.type, date: String(b.date),
    arrive: b.arrive || null, depart: b.depart || null,
    adults: Math.max(0, +b.adults || 0), kids: Math.max(0, +b.kids || 0),
    services: Array.isArray(b.services) ? b.services.slice(0, 12).map(String) : [],
    notes: b.notes ? String(b.notes).slice(0, 1000) : null, payMode: b.payMode || "cash" } });
  return NextResponse.json({ id: r.id });
}
export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  return NextResponse.json(await prisma.reservation.findMany({ orderBy: { date: "asc" } }));
}
