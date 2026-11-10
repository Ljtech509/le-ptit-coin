import { NextResponse } from "next/server";
import { makeToken } from "@/lib/auth";
export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  const token = makeToken();
  const res = NextResponse.json({ token });
  res.cookies.set("ptc", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 2592000 });
  return res;
}
