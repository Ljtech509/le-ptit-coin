"use client";
import { useEffect, useState } from "react";
const J = { "Content-Type": "application/json" };
export default function Compte() {
  const [me, setMe] = useState(undefined);
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));
  async function load() { const r = await fetch("/api/me"); setMe(r.ok ? await r.json() : null); }
  useEffect(() => { load(); }, []);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch(mode === "login" ? "/api/users/login" : "/api/users/register", { method: "POST", headers: J, body: JSON.stringify(f) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Une erreur est survenue."); return; }
    await load();
  }
  async function logout() { await fetch("/api/users/logout", { method: "POST" }); setMe(null); setF({ name: "", email: "", password: "" }); }
  async function readAll() { await fetch("/api/me", { method: "PATCH" }); load(); }
  const day = (d) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (<div className="cp">
    <header className="cbar"><div className="wrap"><a href="/">← Retour au site</a><strong>Mon compte</strong></div></header>
    <main className="cmain">
      {me === undefined && <p>Chargement…</p>}
      {me === null && (
        <form className="card" onSubmit={submit}>
          <div className="tabs2">
            <button type="button" className={mode === "login" ? "on" : ""} onClick={() => { setMode("login"); setErr(""); }}>Connexion</button>
            <button type="button" className={mode === "signup" ? "on" : ""} onClick={() => { setMode("signup"); setErr(""); }}>Créer un compte</button>
          </div>
          {mode === "signup" && <label>Nom et prénom<input required value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></label>}
          <label>E-mail<input type="email" required value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
          <label>Mot de passe<input type="password" required minLength={mode === "signup" ? 6 : undefined} value={f.password} onChange={(e) => set("password", e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
          <p className="small"><a className="lnk" href="/compte/mot-de-passe-oublie">Mot de passe oublié ?</a></p>
          <button className="btn" disabled={busy}>{busy ? "Patientez…" : mode === "login" ? "Se connecter" : "Créer mon compte"}</button>
          {err && <p className="err">{err}</p>}
        </form>)}
      {me && (<>
        <section className="card prof">
          <div className="head2"><h2>Bonjour {me.user.name}</h2><button className="btn sm ghost" onClick={logout}>Se déconnecter</button></div>
          <dl><dt>Nom</dt><dd>{me.user.name}</dd><dt>E-mail</dt><dd>{me.user.email}</dd><dt>Membre depuis</dt><dd>{day(me.user.createdAt)}</dd></dl>
        </section>
        <section className="card">
          <div className="head2"><h2>Notifications{me.unread > 0 ? ` (${me.unread})` : ""}</h2>
            {me.unread > 0 && <button className="btn sm alt" onClick={readAll}>Tout marquer comme lu</button>}</div>
          {!me.notifications.length && <p className="small">Aucune notification pour l’instant.</p>}
          <ul className="notes">{me.notifications.map((n) => (
            <li key={n.id} className={n.read ? "" : "new"}><b>{n.title}</b><span>{n.body}</span><br /><small>{day(n.createdAt)}</small></li>))}</ul>
        </section></>)}
    </main></div>);
}
