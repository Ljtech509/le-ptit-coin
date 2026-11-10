import nodemailer from "nodemailer";
export async function sendMail({ to, subject, text, html }) {
  const user = process.env.GMAIL_USER, pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) { console.log("[EMAIL NON CONFIGURÉ] à:", to, "|", subject, "|", text); return false; }
  const tr = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  await tr.sendMail({ from: `"Le P’tit Coin" <${user}>`, to, subject, text, html });
  return true;
}
