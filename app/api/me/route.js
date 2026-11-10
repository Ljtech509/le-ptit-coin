import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { userIdFromReq } from "@/lib/users";
export async function GET(req) {
  const id = userIdFromReq(req);
  const user = id && (await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, createdAt: true } }));
  if (!user) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  const notifications = await prisma.notification.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 50 });
  return NextResponse.json({ user, notifications, unread: notifications.filter((n) => !n.read).length });
}
export async function PATCH(req) {
  const id = userIdFromReq(req);
  if (!id) return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  await prisma.notification.updateMany({ where: { userId: id, read: false }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
