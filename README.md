# Le P’tit Coin Bar-Resto — site + gestion

## 1. Sur ton PC
1. Installe Node.js (version LTS) : nodejs.org
2. Crée une base Postgres gratuite sur neon.tech et copie le lien de connexion.
3. Copie `.env.example` en `.env` et remplis les 4 valeurs.
4. Mets tes photos dans `public/images/` avec ces noms exacts :
   hero.jpg, piscine.jpg, reunion.jpg, anniversaire.jpg, autre.jpg, g1.jpg à g6.jpg
   (JPG, largeur 1600 px max, moins de 500 Ko chacune).
5. Dans le dossier : `npm install`, puis `npx prisma db push`, puis `npm run dev`
6. Ouvre http://localhost:3000 (site) et http://localhost:3000/admin (gestion).

## 2. Mise en ligne gratuite (Vercel)
1. Mets le dossier sur GitHub (github.com, nouveau dépôt, envoie les fichiers).
2. Sur vercel.com : Add New > Project > choisis le dépôt.
3. Dans Environment Variables, ajoute DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, NEXT_PUBLIC_WHATSAPP.
4. Deploy. Tu obtiens un lien en .vercel.app.

## 3. App mobile (à venir)
L’API `/api/auth/login` renvoie un token (`Authorization: Bearer ...`) pour l’app Android/iOS.
