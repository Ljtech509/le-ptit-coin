"use client";
import { useEffect, useMemo, useState } from "react";
const TYPES = { piscine: "Espace piscine", reunion: "Réunion / Conférence", anniversaire: "Anniversaire", autre: "Autre événement" };
const ST = { pending: "En attente", confirmed: "Confirmée", cancelled: "Annulée" };
const H = { "Content-Type": "application/json" };
export default function Admin() {
  const [rows, setRows] = useState(null); const [tab, setTab] = useState("all");
  async function load() {
    const r = await fetch("/api/reservations");
    if (r.status === 401) { location.href = "/compte"; return; }
    setRows(await r.json());
  }
  useEffect(() => { load(); }, []);
  const patch = async (id, d) => { await fetch("/api/reservations/" + id, { method: "PATCH", headers: H, body: JSON.stringify(d) }); load(); };
  const del = async (id) => { if (confirm("Supprimer cette réservation ?")) { await fetch("/api/reservations/" + id, { method: "DELETE" }); load(); } };
  const all = rows || [];
  const list = useMemo(() => all.filter((r) => tab === "all" || r.type === tab), [all, tab]);
  const live = list.filter((r) => r.status !== "cancelled");
  const dep = live.reduce((s, r) => s + r.deposit, 0), bal = live.reduce((s, r) => s + Math.max(0, r.price - r.deposit), 0);
  const n = (t) => all.filter((r) => t === "all" || r.type === t).length;
  return (<div className="adm">
    <aside className="side"><div className="sb">Le P’tit <span>Coin</span></div>
      {["all", ...Object.keys(TYPES)].map((t) => (
        <button key={t} className={tab === t ? "ni on" : "ni"} onClick={() => setTab(t)}>{t === "all" ? "Vue d’ensemble" : TYPES[t]}<b>{n(t)}</b></button>))}
      <a className="ni" href="/admin/media">Gestion des photos <b>↗</b></a>
      <button className="ni" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); location.href = "/compte"; }}>Se déconnecter</button></aside>
    <main className="am"><h2>{tab === "all" ? "Vue d’ensemble" : TYPES[tab]}</h2>
      <div className="kp"><div><b>{list.length}</b>Réservations</div><div><b>{dep.toLocaleString("fr-FR")}</b>Acomptes (HTG)</div><div><b>{bal.toLocaleString("fr-FR")}</b>Soldes (HTG)</div></div>
      {rows === null && <p>Chargement…</p>}
      {rows && !list.length && <p className="small">Aucune réservation pour l’instant.</p>}
      {list.map((r) => (<article key={r.id} className="rr">
        <div className="rt"><strong>{r.name}</strong><span className={"bd " + r.status}>{ST[r.status]}</span></div>
        <p className="small">{TYPES[r.type]} · {r.date} {r.arrive || ""} · {r.adults + r.kids} pers. · WhatsApp {r.whatsapp}</p>
        {r.services.length > 0 && <p className="small">{r.services.join(", ")}</p>}
        {r.notes && <p className="small">{r.notes}</p>}
        <div className="ra">
          <label>Prix<input type="number" defaultValue={r.price} onBlur={(e) => patch(r.id, { price: e.target.value })} /></label>
          <label>Acompte<input type="number" defaultValue={r.deposit} onBlur={(e) => patch(r.id, { deposit: e.target.value })} /></label>
          <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })}>{Object.entries(ST).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <a className="btn sm" href={"https://wa.me/" + r.whatsapp.replace(/\D/g, "")} target="_blank">WhatsApp</a>
          <button className="btn sm del" onClick={() => del(r.id)}>Supprimer</button></div></article>))}
    </main></div>);
}
