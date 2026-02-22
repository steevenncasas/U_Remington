const { validationResult } = require("express-validator");
const service = require("../services/perfil.service");

async function list(req, res) {
  const perfiles = await service.list();
  res.render("perfiles/list", { title: "Gestión Perfil", perfiles, edit: null });
}

async function newForm(req, res) {
  const perfiles = await service.list();
  res.render("perfiles/list", { title: "Gestión Perfil", perfiles, edit: { idperfil: "", descripc: "", estado: "Activo" } });
}

async function editForm(req, res) {
  const perfiles = await service.list();
  const edit = await service.get(req.params.id);
  if (!edit) {
    req.flash("error", "Perfil no encontrado.");
    return res.redirect("/perfiles");
  }
  res.render("perfiles/list", { title: "Gestión Perfil", perfiles, edit });
}

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect("/perfiles/nuevo");
  }
  await service.create(req.body);
  req.flash("success", "Perfil guardado correctamente.");
  res.redirect("/perfiles");
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect(`/perfiles/${req.params.id}/editar`);
  }
  const ok = await service.update(req.params.id, req.body);
  if (!ok) req.flash("error", "No se pudo actualizar.");
  else req.flash("success", "Perfil actualizado.");
  res.redirect("/perfiles");
}

async function disable(req, res) {
  await service.disable(req.params.id);
  req.flash("info", "Perfil inhabilitado (borrado lógico).");
  res.redirect("/perfiles");
}

module.exports = { list, newForm, editForm, create, update, disable };
