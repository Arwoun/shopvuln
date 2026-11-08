// Point d'entrée de l'application ShopVuln
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const config = require("./config");
const { init } = require("./db");

const db = init();
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: false, secure: false },
  })
);

app.use(require("./routes/auth")(db));
app.use(require("./routes/shop")(db));
app.use(require("./routes/tools")(db));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err);
  if (config.debug) {
    return res.status(500).send(`<h1>Erreur</h1><pre>${err.stack}</pre>`);
  }
  res.status(500).send("Erreur interne");
});

app.listen(config.port, () => {
  console.log(`ShopVuln démarré sur http://localhost:${config.port}`);
});
