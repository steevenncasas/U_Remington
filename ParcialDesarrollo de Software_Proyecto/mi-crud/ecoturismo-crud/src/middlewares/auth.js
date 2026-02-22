function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect("/login");
  res.locals.currentUser = req.session.user;
  next();
}

function requireAdmin(req, res, next) {
  const u = req.session.user;
  if (!u) return res.redirect("/login");
  if (u.perfil !== "Administrador") {
    req.flash("error", "Acceso denegado: solo Administrador.");
    return res.redirect("/");
  }
  res.locals.currentUser = u;
  next();
}

module.exports = { requireAuth, requireAdmin };
