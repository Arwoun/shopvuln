// Configuration de l'application ShopVuln
module.exports = {
  port: 3000,
  sessionSecret: "shopvuln-secret-2024",
  adminApiKey: "sk_live_9f8e7d6c5b4a3f2e1d0c",
  dbFile: __dirname + "/shop.db",
  filesDir: __dirname + "/files",
  debug: true,
};
