"use client";
import { useEffect, useState } from "react";
export default function Reset() {
  const [token, setToken] = useState(""); const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [err, setErr] = useState(""); const [ok, setOk] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => { setToken(new URLSearchParams(window.location.search).get("token") || ""); }, []);
  async function submit(e) {
    e.preventDefault(); setErr("");
    if (pw !== pw2) { setErr("Les deux mots de passe sont différents."); return; }
    setBusy(true);
    const r = await fetch("/api/auth/reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: pw }) });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Une erreur est survenue."); return; }
    setOk(true);
  }
  return (<div className="cp">
    <header className="cbar"><div className="wrap"><a href="/">← Retour au site</a><strong>Nouveau mot de passe</strong></div></header>
    <main className="cmain">
      {ok ? (<section className="card done"><h2>Mot de passe modifié</h2><p className="ok">Vous êtes connecté.</p><p style={{ marginTop: 16 }}><a className="btn" href="/compte">Voir mon compte</a></p></section>)
      : (<form className="card" onSubmit={submit}>
          <h2>Nouveau mot de passe</h2>
          <label>Nouveau mot de passe<input type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
          <label>Confirmer le mot de passe<input type="password" required minLength={6} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></label>
          <button className="btn" disabled={busy || !token}>{busy ? "Patientez…" : "Enregistrer"}</button>
          {!token && <p className="err">Lien incomplet : ouvrez le lien reçu par e-mail.</p>}
          {err && <p className="err">{err}</p>}
        </form>)}
    </main></div>);
}
