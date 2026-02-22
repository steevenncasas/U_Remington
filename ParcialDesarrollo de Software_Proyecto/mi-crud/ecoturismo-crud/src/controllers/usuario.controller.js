const { validationResult } = require("express-validator");
const service = require("../services/usuario.service");

async function list(req, res) {
  const usuarios = await service.list();
  const perfiles = await service.listPerfilesActivos();
  const personas = await service.listPersonasActivas();
  res.render("usuarios/list", { title: "Gestión Usuario", usuarios, perfiles, personas, edit: null });
}

async function newForm(req, res) {
  const usuarios = await service.list();
  const perfiles = await service.listPerfilesActivos();
  const personas = await service.listPersonasActivas();
  res.render("usuarios/list", {
    title: "Gestión Usuario",
    usuarios, perfiles, personas,
    edit: { idusuario: "", nombreu: "", contrasena: "", idperfil: "", idpersona: "", estado: "Activo" }
  });
}

async function editForm(req, res) {
  const usuarios = await service.list();
  const perfiles = await service.listPerfilesActivos();
  const personas = await service.listPersonasActivas();
  const edit = await service.get(req.params.id);

  if (!edit) {
    req.flash("error", "Usuario no encontrado.");
    return res.redirect("/usuarios");
  }

  edit.contrasena = ""; // no prellenar contraseña
  res.render("usuarios/list", { title: "Gestión Usuario", usuarios, perfiles, personas, edit });
}

async function create(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect("/usuarios/nuevo");
  }

  try {
    await service.create(req.body);
    req.flash("success", "Usuario guardado correctamente.");
    return res.redirect("/usuarios");
  } catch (err) {
    if (err.code === "PERSONA_YA_TIENE_USUARIO") {
      req.flash("error", err.message);
      return res.redirect("/usuarios/nuevo");
    }
    console.error(err);
    req.flash("error", "Ocurrió un error al guardar el usuario.");
    return res.redirect("/usuarios/nuevo");
  }
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect(`/usuarios/${req.params.id}/editar`);
  }

  try {
    const ok = await service.update(req.params.id, req.body);
    if (!ok) req.flash("error", "No se pudo actualizar.");
    else req.flash("success", "Usuario actualizado.");
    return res.redirect("/usuarios");
  } catch (err) {
    if (err.code === "PERSONA_YA_TIENE_USUARIO") {
      req.flash("error", err.message);
      return res.redirect(`/usuarios/${req.params.id}/editar`);
    }
    console.error(err);
    req.flash("error", "Ocurrió un error al actualizar el usuario.");
    return res.redirect(`/usuarios/${req.params.id}/editar`);
  }
}

async function disable(req, res) {
  await service.disable(req.params.id);
  req.flash("info", "Usuario inhabilitado (borrado lógico).");
  res.redirect("/usuarios");
}

module.exports = { list, newForm, editForm, create, update, disable };