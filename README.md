# ShopVuln — entraînement examen « Test intrusion web & remédiation »

> ⚠️ Application **volontairement vulnérable**. À lancer uniquement en local. Ne jamais la déployer.

## Le sujet (comme vendredi)

ShopVuln est une petite boutique en ligne (Node.js / Express / SQLite).
Elle contient **10 vulnérabilités**. Ta mission, en **1 heure** :

1. Identifier au moins **2 vulnérabilités** (plus si tu as le temps).
2. Les **corriger** dans le code, sur une branche, puis ouvrir une **pull request**.
3. Rédiger un **rapport** (`RAPPORT.md`) — c'est la partie la plus notée.

## Lancer l'application

Prérequis : Node.js **22.13 ou plus récent** (`node --version`).

```bash
npm install
npm start
```

Puis ouvre http://localhost:3000

Comptes de test :

| Utilisateur | Mot de passe |
|---|---|
| alice | alice123 |
| bob | bobpassword |

Pour remettre la base à zéro : `npm run init-db`

## Workflow Git attendu

```bash
git checkout -b fix/securite
# ... corrections ...
git add .
git commit -m "fix: requêtes SQL paramétrées sur /login (SQLi)"
git push -u origin fix/securite
# puis ouvrir la pull request sur GitHub
```

Un commit par vulnérabilité corrigée, avec un message clair : ça se lit très bien dans une PR.

## Arborescence

```
app.js              point d'entrée, sessions, gestion d'erreurs
config.js           configuration
db.js               schéma et données de départ
views.js            rendu HTML
middleware/auth.js  contrôle de connexion / rôle admin
routes/auth.js      connexion, inscription
routes/shop.js      produits, avis, commandes, profil
routes/tools.js     téléchargement, aperçu d'image, admin, ping
```

Le modèle de rapport est dans `RAPPORT_TEMPLATE.md`.
