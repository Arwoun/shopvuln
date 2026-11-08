// Routes boutique : produits, avis, commandes, profil
const express = require("express");
const { layout } = require("../views");
const { requireLogin } = require("../middleware/auth");

module.exports = (db) => {
  const router = express.Router();

  // Liste des produits
  router.get("/", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    const list = products
      .map(
        (p) => `<li><a href="/product/${p.id}">${p.name}</a> — ${p.price.toFixed(2)} €</li>`
      )
      .join("");
    res.send(layout("Accueil", req.session.user, `<h1>Nos produits</h1><ul>${list}</ul>`));
  });

  // Fiche produit + avis
  router.get("/product/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (!product) return res.status(404).send("Produit introuvable");

    const reviews = db
      .prepare("SELECT author, content FROM reviews WHERE product_id = ?")
      .all(product.id);
    const reviewsHtml = reviews
      .map((r) => `<div class="review"><b>${r.author}</b> : ${r.content}</div>`)
      .join("");

    res.send(
      layout(product.name, req.session.user, `
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <p class="price">${product.price.toFixed(2)} €</p>

      <form method="POST" action="/checkout">
        <input type="hidden" name="productId" value="${product.id}">
        <input type="hidden" name="price" value="${product.price}">
        Quantité : <input name="quantity" type="number" value="1" min="1">
        Adresse : <input name="address" placeholder="Adresse de livraison">
        <button>Acheter</button>
      </form>

      <h2>Avis</h2>
      ${reviewsHtml || "<p>Aucun avis.</p>"}
      ${
        req.session.user
          ? `<form method="POST" action="/product/${product.id}/review">
               <textarea name="content" placeholder="Votre avis"></textarea>
               <button>Publier</button>
             </form>`
          : ""
      }`)
    );
  });

  // Publier un avis
  router.post("/product/:id/review", requireLogin, (req, res) => {
    db.prepare("INSERT INTO reviews (product_id, author, content) VALUES (?, ?, ?)").run(
      req.params.id,
      req.session.user.username,
      req.body.content
    );
    res.redirect("/product/" + req.params.id);
  });

  // Passer commande
  router.post("/checkout", requireLogin, (req, res) => {
    const productId = parseInt(req.body.productId, 10);
    const quantity = parseInt(req.body.quantity, 10);
    const price = parseFloat(req.body.price);
    const total = price * quantity;

    const info = db
      .prepare(
        "INSERT INTO orders (user_id, product_id, quantity, total, address) VALUES (?, ?, ?, ?, ?)"
      )
      .run(req.session.user.id, productId, quantity, total, req.body.address);

    res.redirect("/orders/" + info.lastInsertRowid);
  });

  // Mes commandes
  router.get("/orders", requireLogin, (req, res) => {
    const orders = db
      .prepare("SELECT id, total FROM orders WHERE user_id = ?")
      .all(req.session.user.id);
    const list = orders
      .map((o) => `<li><a href="/orders/${o.id}">Commande #${o.id}</a> — ${o.total.toFixed(2)} €</li>`)
      .join("");
    res.send(layout("Mes commandes", req.session.user, `<h1>Mes commandes</h1><ul>${list}</ul>`));
  });

  // Détail d'une commande
  router.get("/orders/:id", requireLogin, (req, res) => {
    const order = db
      .prepare(
        `SELECT o.*, p.name AS product, u.username, u.email
         FROM orders o
         JOIN products p ON p.id = o.product_id
         JOIN users u ON u.id = o.user_id
         WHERE o.id = ?`
      )
      .get(req.params.id);
    if (!order) return res.status(404).send("Commande introuvable");

    res.send(
      layout("Commande", req.session.user, `
      <h1>Commande #${order.id}</h1>
      <p>Client : ${order.username} (${order.email})</p>
      <p>Produit : ${order.product} × ${order.quantity}</p>
      <p>Total : ${order.total.toFixed(2)} €</p>
      <p>Livraison : ${order.address}</p>`)
    );
  });

  // Profil
  router.get("/profile", requireLogin, (req, res) => {
    const u = req.session.user;
    res.send(
      layout("Profil", u, `
      <h1>Mon profil</h1>
      <form method="POST" action="/profile">
        <label>Email <input name="email" value="${u.email || ""}"></label>
        <button>Enregistrer</button>
      </form>`)
    );
  });

  router.post("/profile", requireLogin, (req, res) => {
    const fields = Object.keys(req.body);
    for (const field of fields) {
      db.prepare(`UPDATE users SET ${field} = ? WHERE id = ?`).run(
        req.body[field],
        req.session.user.id
      );
    }
    req.session.user = db
      .prepare("SELECT id, username, email, role FROM users WHERE id = ?")
      .get(req.session.user.id);
    res.redirect("/profile");
  });

  return router;
};
