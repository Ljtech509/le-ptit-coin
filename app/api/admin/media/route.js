import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
const ROOT = path.join(process.cwd(), "public", "images");
const FIXED = new Set(["hero.jpg", "piscine.jpg", "reunion.jpg", "anniversaire.jpg", "autre.jpg"]);
const safe = (name) => typeof name === "string" && /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,100}\.(jpg|jpeg|png|webp)$/i.test(name);

export async function GET(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await fs.mkdir(ROOT, { recursive: true });
  const names = (await fs.readdir(ROOT)).filter(safe).sort();
  return NextResponse.json(names.map(name => ({ name, url: `/images/${encodeURIComponent(name)}`, fixed: FIXED.has(name) })));
}

export async function POST(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const slot = String(form.get("slot") || "gallery");
  if (!file || typeof file.arrayBuffer !== "function") return NextResponse.json({ error: "Choisissez une photo." }, { status: 400 });
  if (!file.type?.startsWith("image/") || file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "Image invalide (maximum 8 Mo)." }, { status: 400 });
  const ext = ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" })[file.type];
  if (!ext) return NextResponse.json({ error: "Formats acceptés : JPG, PNG, WebP." }, { status: 400 });
  const targets = { hero: "hero", piscine: "piscine", reunion: "reunion", anniversaire: "anniversaire", autre: "autre" };
  if (targets[slot] && ext !== ".jpg") return NextResponse.json({ error: "Pour les backgrounds fixes, envoyez une photo JPG." }, { status: 400 });
  const name = targets[slot] ? `${targets[slot]}.jpg` : `gallery-${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
  await fs.mkdir(ROOT, { recursive: true });
  if (targets[slot]) { for (const old of await fs.readdir(ROOT)) if (old.startsWith(`${targets[slot]}.`)) await fs.unlink(path.join(ROOT, old)).catch(() => {}); }
  await fs.writeFile(path.join(ROOT, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ name, url: `/images/${encodeURIComponent(name)}` });
}

export async function DELETE(req) {
  if (!isAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { name } = await req.json().catch(() => ({}));
  if (!safe(name) || FIXED.has(name)) return NextResponse.json({ error: "Cette image ne peut pas être supprimée ici." }, { status: 400 });
  try { await fs.unlink(path.join(ROOT, name)); } catch { return NextResponse.json({ error: "Photo introuvable." }, { status: 404 }); }
  return NextResponse.json({ ok: true });
}
