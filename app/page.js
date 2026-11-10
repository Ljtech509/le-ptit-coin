import BookingForm from "@/components/BookingForm";
import fs from "node:fs/promises";
import path from "node:path";
const SP = [
  ["piscine", "Espace piscine", "Baignade, détente et soleil entre amis ou en famille.", "linear-gradient(140deg,#0A6F7D,#18B2C1)"],
  ["reunion", "Réunion / Conférence", "Un cadre agréable et calme pour vos rencontres.", "linear-gradient(140deg,#0B2A3C,#3F6FB0)"],
  ["anniversaire", "Anniversaire", "Gâteau, décoration, musique : préparons la fête ensemble.", "linear-gradient(140deg,#C42B58,#F0627A)"],
  ["autre", "Autre événement", "Fête, célébration ou sortie de groupe.", "linear-gradient(140deg,#17653F,#35A468)"],
];
const SV = ["Accès piscine", "Sonorisation", "Repas / Menu", "Gâteau", "Tables et chaises", "Décoration", "Boissons", "Espace privé"];
export default async function Home() {
  let gallery = [1, 2, 3, 4, 5, 6].map(i => `/images/g${i}.jpg`);
  try {
    const files = await fs.readdir(path.join(process.cwd(), "public", "images"));
    const uploaded = files.filter(name => /^gallery-[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(name)).sort().map(name => `/images/${encodeURIComponent(name)}`);
    if (uploaded.length) gallery = uploaded;
  } catch {}
  return (<>
    <header className="top"><div className="wrap row"><a className="brand" href="#">Le P’tit <span>Coin</span></a>
      <nav><a href="#espaces">Espaces</a><a href="#services">Services</a><a href="#galerie">Galerie</a><a href="#contact">Contact</a></nav>
      <a href="/compte" aria-label="Mon compte" style={{display:"grid",placeItems:"center",width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(255,255,255,.45)",color:"#fff"}}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg></a>
      <a className="btn sm" href="#reserver">Réserver</a></div></header>
    <section className="hero"><div className="wrap">
      <h1>Le P’tit <em>Coin</em></h1>
      <p>Bar-resto avec piscine à Fauché, Grand-Goâve. Détendez-vous, fêtez, réunissez-vous.</p>
      <a className="btn" href="#reserver">Réserver mon espace</a></div></section>
    <section id="espaces" className="wrap sec"><h2>Un espace pour chaque occasion</h2>
      <div className="spaces">{SP.map(([id, t, d, fb]) => (
        <article key={id} className="sp" style={{ "--img": `url(/images/${id}.jpg)`, "--fb": fb }}><div><h3>{t}</h3><p>{d}</p></div></article>))}</div></section>
    <section id="services" className="band"><div className="wrap sec"><h2>Services à la carte</h2>
      <div className="svc">{SV.map((s) => <span key={s}>{s}</span>)}</div></div></section>
    <section id="galerie" className="wrap sec"><h2>Galerie</h2>
      <div className="gal">{gallery.map((src) => <div key={src} style={{ backgroundImage: `url(${src})` }} />)}</div></section>
    <section id="reserver" className="book"><div className="wrap sec"><h2>Réserver votre espace</h2><BookingForm /></div></section>
    <section id="contact" className="wrap sec"><h2>Nous trouver</h2>
      <p className="addr">Route Nationale #2, km 48,<br />Fauché, Grand-Goâve</p></section>
      <footer><p>Merci d’avoir choisi Le P’tit Coin Bar-Resto</p></footer>
  </>);
}
