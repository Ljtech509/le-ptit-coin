import "./globals.css";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--display", weight: ["700", "800"] });
const body = Figtree({ subsets: ["latin"], variable: "--body" });
export const metadata = { title: "Le P’tit Coin Bar-Resto | Piscine, réunions, fêtes à Fauché", description: "Bar-resto avec piscine à Fauché, Grand-Goâve. Réservez votre espace en ligne." };
export default function RootLayout({ children }) {
  return (<html lang="fr"><body className={display.variable + " " + body.variable}>{children}</body></html>);
}
