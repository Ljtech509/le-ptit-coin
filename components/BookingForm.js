"use client";
import { useState } from "react";
const SV = ["Accès piscine", "Sonorisation", "Repas / Menu", "Gâteau", "Tables et chaises", "Décoration", "Boissons", "Espace privé"];
const TY = [["piscine", "Espace piscine"], ["reunion", "Réunion / Conférence"], ["anniversaire", "Anniversaire"], ["autre", "Autre"]];
export default function BookingForm() {
  const [f, setF] = useState({ type: "piscine", adults: 1, kids: 0, services: [], payMode: "cash" });
  const [state, setState] = useState("idle");
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));
  const toggle = (s) => set("services", f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s]);
  async function submit(e) {
    e.preventDefault(); setState("loading");
    const r = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    setState(r.ok ? "done" : "error");
  }
  const wa = (process.env.NEXT_PUBLIC_WHATSAPP || "").replace(/\D/g, "");
  const msg = encodeURIComponent(`Bonjour Le P’tit Coin, je viens de faire une demande de réservation (${f.name}, ${f.date}).`);
  if (state === "done") return (
    <div className="card done"><h3>Demande envoyée</h3><p>Merci {f.name} ! Nous vous contactons sur WhatsApp. La réservation est confirmée après versement de l’acompte.</p>
      {wa && <a className="btn" href={`https://wa.me/${wa}?text=${msg}`}>Nous écrire sur WhatsApp</a>}</div>);
  return (
    <form className="card" onSubmit={submit}>
      <div className="grid">
        <label>Nom et prénom<input required onChange={(e) => set("name", e.target.value)} /></label>
        <label>WhatsApp<input required inputMode="tel" onChange={(e) => set("whatsapp", e.target.value)} /></label>
        <label>Téléphone<input inputMode="tel" onChange={(e) => set("phone", e.target.value)} /></label>
        <label>E-mail<input type="email" onChange={(e) => set("email", e.target.value)} /></label>
        <label>Date<input type="date" required onChange={(e) => set("date", e.target.value)} /></label>
        <label>Type<select value={f.type} onChange={(e) => set("type", e.target.value)}>{TY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label>Heure d’arrivée<input type="time" onChange={(e) => set("arrive", e.target.value)} /></label>
        <label>Heure de départ<input type="time" onChange={(e) => set("depart", e.target.value)} /></label>
        <label>Adultes<input type="number" min="0" value={f.adults} onChange={(e) => set("adults", e.target.value)} /></label>
        <label>Enfants<input type="number" min="0" value={f.kids} onChange={(e) => set("kids", e.target.value)} /></label>
      </div>
      <p className="lbl">Services souhaités</p>
      <div className="chips">{SV.map((s) => <button type="button" key={s} className={f.services.includes(s) ? "chip on" : "chip"} onClick={() => toggle(s)}>{s}</button>)}</div>
      <label>Demandes spéciales<textarea rows="3" onChange={(e) => set("notes", e.target.value)} /></label>
      <label>Acompte prévu par<select value={f.payMode} onChange={(e) => set("payMode", e.target.value)}><option value="cash">Espèces</option><option value="moncash">MonCash</option><option value="natcash">NatCash</option></select></label>
      <p className="small">La réservation est confirmée après versement de l’acompte. Toute modification doit être communiquée à l’avance.</p>
      <button className="btn" disabled={state === "loading"}>{state === "loading" ? "Envoi…" : "Envoyer ma demande"}</button>
      {state === "error" && <p className="err">Une erreur est survenue, réessayez.</p>}
    </form>);
}
