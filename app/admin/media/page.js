"use client";
import { useEffect, useState } from "react";
const SLOTS = [
  ["hero", "Photo principale (background du titre et de Réserver)"],
  ["piscine", "Background — Espace piscine"],
  ["reunion", "Background — Réunion / Conférence"],
  ["anniversaire", "Background — Anniversaire"],
  ["autre", "Background — Autre événement"],
  ["gallery", "Ajouter à la galerie"],
];
export default function MediaAdmin() {
  const [items, setItems] = useState([]), [slot, setSlot] = useState("hero"), [file, setFile] = useState(null), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  async function load() { const r = await fetch("/api/admin/media"); if (r.status === 401) { location.href = "/compte"; return; } setItems(await r.json()); }
  useEffect(() => { load(); }, []);
  async function upload(e) { e.preventDefault(); if (!file) return setMsg("Sélectionnez une photo."); setBusy(true); setMsg(""); const fd = new FormData(); fd.append("file", file); fd.append("slot", slot); const r = await fetch("/api/admin/media", { method: "POST", body: fd }); const d = await r.json(); setMsg(r.ok ? "Photo ajoutée avec succès." : d.error || "Erreur upload"); if (r.ok) { setFile(null); e.target.reset(); await load(); } setBusy(false); }
  async function remove(name) { if (!confirm(`Supprimer ${name} de la galerie ?`)) return; const r = await fetch("/api/admin/media", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) }); const d = await r.json(); setMsg(r.ok ? "Photo supprimée." : d.error); if (r.ok) load(); }
  return <main className="am media-admin"><a className="btn sm" href="/admin">← Retour aux réservations</a><h2>Gestion des photos</h2><p className="small">Changez le background principal, les photos des événements ou ajoutez/supprimez des photos de galerie.</p>
    <form className="media-form" onSubmit={upload}><label>Emplacement<select value={slot} onChange={e=>setSlot(e.target.value)}>{SLOTS.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>Photo (JPG, PNG ou WebP, max. 8 Mo)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)} required /></label><button className="btn" disabled={busy}>{busy ? "Envoi…" : "Ajouter / remplacer la photo"}</button>{msg && <p role="status" className="small">{msg}</p>}</form>
    <h3>Photos actuellement disponibles</h3><div className="media-grid">{items.map(it=><article className="media-card" key={it.name}><img src={it.url} alt={it.name}/><div><strong>{it.name}</strong><p className="small">{it.fixed ? "Image de section (remplaçable)" : "Photo de galerie"}</p>{!it.fixed && <button className="btn sm del" onClick={()=>remove(it.name)}>Supprimer</button>}</div></article>)}</div>
  </main>;
}
