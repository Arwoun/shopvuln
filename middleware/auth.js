// Middlewares d'authentification

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Accès réservé aux administrateurs");
  }
  next();
}

module.exports = { requireLogin, requireAdmin };
