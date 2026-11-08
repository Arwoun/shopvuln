// Routes d'authentification : connexion, inscription, déconnexion
const express = require("express");
const { layout } = require("../views");

module.exports = (db) => {
  const router = express.Router();

  router.get("/login", (req, res) => {
    res.send(
      layout("Connexion", req.session.user, `
      <h1>Connexion</h1>
      <form method="POST" action="/login">
        <input name="username" placeholder="Nom d'utilisateur">
        <input name="password" type="password" placeholder="Mot de passe">
        <button>Se connecter</button>
      </form>`)
    );
  });

  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    const query =
      "SELECT id, username, email, role FROM users WHERE username = '" +
      username + "' AND password = '" + password + "'";
    const user = db.prepare(query).get();

    if (!user) {
      return res.status(401).send(
        layout("Connexion", null, `<p class="error">Identifiants invalides</p><a href="/login">Réessayer</a>`)
      );
    }
    req.session.user = user;
    res.redirect("/");
  });

  router.get("/register", (req, res) => {
    res.send(
      layout("Inscription", req.session.user, `
      <h1>Inscription</h1>
      <form method="POST" action="/register">
        <input name="username" placeholder="Nom d'utilisateur">
        <input name="email" placeholder="Email">
        <input name="password" type="password" placeholder="Mot de passe">
        <button>Créer mon compte</button>
      </form>`)
    );
  });

  router.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    db.prepare(
      "INSERT INTO users (username, password, email) VALUES (?, ?, ?)"
    ).run(username, password, email);
    res.redirect("/login");
  });

  router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/"));
  });

  return router;
};
