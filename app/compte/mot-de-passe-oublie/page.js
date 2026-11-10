"use client";
import { useState } from "react";
const MAILBOX = { "gmail.com": "https://mail.google.com", "outlook.com": "https://outlook.live.com/mail", "hotmail.com": "https://outlook.live.com/mail", "live.com": "https://outlook.live.com/mail", "yahoo.com": "https://mail.yahoo.com", "yahoo.fr": "https://mail.yahoo.com" };
export default function Forgot() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const r = await fetch("/api/auth/forgot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password: pw }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (d.admin) { location.href = "/admin"; return; }
    if (d.sent) { setSent(true); return; }
    setErr(d.error || "Une erreur est survenue.");
  }
  const box = MAILBOX[email.trim().toLowerCase().split("@")[1]];
  return (<div className="cp">
    <header className="cbar"><div className="wrap"><a href="/compte">← Retour</a><strong>Mot de passe oublié</strong></div></header>
    <main className="cmain">
      {sent ? (
        <section className="card done"><h2>Vérifiez votre boîte mail</h2>
          <p>Si un compte existe pour <b>{email}</b>, un lien de réinitialisation vient d’être envoyé. Il est valable 1 heure. Pensez à regarder les courriers indésirables.</p>
          <p style={{ marginTop: 16 }}>{box && <a className="btn" href={box} target="_blank" rel="noreferrer">Ouvrir ma boîte mail</a>}</p></section>
      ) : (
        <form className="card" onSubmit={submit}>
          <h2>Mot de passe oublié</h2>
          <p className="small" style={{ marginBottom: 14 }}>Entrez votre e-mail : nous vous envoyons un lien pour choisir un nouveau mot de passe.</p>
          <label>E-mail<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Nouveau mot de passe<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
          <button className="btn" disabled={busy}>{busy ? "Patientez…" : "Valider"}</button>
          {err && <p className="err">{err}</p>}
        </form>)}
    </main></div>);
}
