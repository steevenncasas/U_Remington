function globals(req, res, next) {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    info: req.flash("info"),
  };
  res.locals.currentUser = req.session.user || null;
  next();
}

module.exports = { globals };
