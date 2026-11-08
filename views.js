// Petit moteur de rendu HTML maison

function layout(title, user, body) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>${title} - ShopVuln</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <header>
    <a href="/" class="logo">ShopVuln</a>
    <nav>
      ${
        user
          ? `<span>Connecté : ${user.username}</span>
             <a href="/orders">Mes commandes</a>
             <a href="/profile">Profil</a>
             ${user.role === "admin" ? '<a href="/admin">Admin</a>' : ""}
             <a href="/logout">Déconnexion</a>`
          : `<a href="/login">Connexion</a><a href="/register">Inscription</a>`
      }
    </nav>
  </header>
  <main>${body}</main>
</body>
</html>`;
}

module.exports = { layout };
