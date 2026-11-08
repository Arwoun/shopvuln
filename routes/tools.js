// Outils divers : téléchargement de factures, aperçu d'image, diagnostic réseau
const express = require("express");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const config = require("../config");
const { layout } = require("../views");
const { requireLogin, requireAdmin } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // Téléchargement d'un document (CGV, factures PDF…)
  // ex : /download?file=cgv.txt
  router.get("/download", requireLogin, (req, res) => {
    const filePath = path.join(config.filesDir, req.query.file);
    if (!fs.existsSync(filePath)) return res.status(404).send("Fichier introuvable");
    res.sendFile(filePath);
  });

  // Aperçu d'une image produit hébergée ailleurs
  // ex : /preview?url=https://cdn.example.com/img.png
  router.get("/preview", requireLogin, async (req, res, next) => {
    try {
      const response = await fetch(req.query.url);
      const body = await response.text();
      res.type(response.headers.get("content-type") || "text/plain").send(body);
    } catch (err) {
      next(err);
    }
  });

  // Panneau d'administration
  router.get("/admin", requireAdmin, (req, res) => {
    const users = db.prepare("SELECT id, username, email, role FROM users").all();
    const rows = users
      .map((u) => `<tr><td>${u.id}</td><td>${u.username}</td><td>${u.email}</td><td>${u.role}</td></tr>`)
      .join("");
    res.send(
      layout("Admin", req.session.user, `
      <h1>Administration</h1>
      <table><tr><th>ID</th><th>Utilisateur</th><th>Email</th><th>Rôle</th></tr>${rows}</table>
      <h2>Diagnostic réseau</h2>
      <form method="GET" action="/admin/ping">
        <input name="host" placeholder="ex : 8.8.8.8">
        <button>Ping</button>
      </form>`)
    );
  });

  // Diagnostic réseau : ping d'un hôte
  router.get("/admin/ping", requireAdmin, (req, res) => {
    exec("ping -c 2 " + req.query.host, (err, stdout, stderr) => {
      res.send(layout("Ping", req.session.user, `<pre>${stdout}${stderr}</pre>`));
    });
  });

  return router;
};
