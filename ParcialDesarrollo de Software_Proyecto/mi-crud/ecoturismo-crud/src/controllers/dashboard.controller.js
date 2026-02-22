function dashboard(req, res) {
  res.render("dashboard", { title: "Ecoturismo - EL Canto Cipriano" });
}

module.exports = { dashboard };
