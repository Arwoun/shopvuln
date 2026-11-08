// Accès base de données (SQLite intégré à Node >= 22.13)
const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const config = require("./config");

function init(reset = false) {
  if (reset && fs.existsSync(config.dbFile)) fs.unlinkSync(config.dbFile);
  const db = new DatabaseSync(config.dbFile);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'user'
    );
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total REAL NOT NULL,
      address TEXT
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);

  const count = db.prepare("SELECT COUNT(*) AS n FROM users").get().n;
  if (count === 0) {
    const addUser = db.prepare(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)"
    );
    addUser.run("admin", "Adm1n!2024", "admin@shopvuln.local", "admin");
    addUser.run("alice", "alice123", "alice@mail.com", "user");
    addUser.run("bob", "bobpassword", "bob@mail.com", "user");

    const addProduct = db.prepare(
      "INSERT INTO products (name, description, price) VALUES (?, ?, ?)"
    );
    addProduct.run("Casque audio", "Casque sans fil, réduction de bruit", 149.99);
    addProduct.run("Clavier mécanique", "Switches rouges, RGB", 89.9);
    addProduct.run("Écran 27 pouces", "QHD 165 Hz", 329.0);

    const addOrder = db.prepare(
      "INSERT INTO orders (user_id, product_id, quantity, total, address) VALUES (?, ?, ?, ?, ?)"
    );
    addOrder.run(2, 1, 1, 149.99, "12 rue des Lilas, 75011 Paris");
    addOrder.run(3, 3, 1, 329.0, "5 avenue Victor Hugo, 69002 Lyon");
    addOrder.run(1, 2, 2, 179.8, "1 place de la Bourse, 33000 Bordeaux");

    db.prepare(
      "INSERT INTO reviews (product_id, author, content) VALUES (?, ?, ?)"
    ).run(1, "alice", "Super casque, je recommande !");
  }
  return db;
}

if (require.main === module) {
  init(process.argv.includes("--reset"));
  console.log("Base initialisée :", config.dbFile);
}

module.exports = { init };
