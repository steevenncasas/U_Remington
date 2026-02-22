const { validationResult } = require("express-validator");
const personaService = require("../services/persona.service");
const usuarioService = require("../services/usuario.service");

async function list(req, res) {
  const personas = await personaService.list();
  res.render("personas/list", { title: "Gestión Persona", personas, edit: null, isRegister: false });
}

async function newForm(req, res) {
  const personas = await personaService.list();
  const isRegister = String(req.query.register || "0") === "1";
  res.render("personas/list", {
    title: isRegister ? "Registrarse" : "Gestión Persona",
    personas,
    edit: {
      idpersona: "",
      nom1: "", nom2: "", apel1: "", apel2: "",
      direccion: "", tele: "", movil: "",
      correo: "", fecha_nac: "",
      estado: "Activo",
    },
    isRegister
  });
}

async function editForm(req, res) {
  const personas = await personaService.list();
  const edit = await personaService.get(req.params.id);
  if (!edit) {
    req.flash("error", "Persona no encontrada.");
    return res.redirect("/personas");
  }
  res.render("personas/list", { title: "Gestión Persona", personas, edit, isRegister: false });
}

async function create(req, res) {
  const errors = validationResult(req);
  const isRegister = String(req.query.register || "0") === "1";

  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect(isRegister ? "/personas/nuevo?register=1" : "/personas/nuevo");
  }

  const idpersona = await personaService.create(req.body);

  // Si es registrarse, también creamos el usuario con perfil Persona
  if (isRegister) {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash("error", "Para registrarse debe crear usuario y contraseña.");
      return res.redirect("/personas/nuevo?register=1");
    }

    // Buscar idperfil de "Persona"
    const perfiles = await usuarioService.listPerfilesActivos();
    const personaPerfil = perfiles.find(p => p.descripc === "Persona");
    const idperfil = personaPerfil ? personaPerfil.idperfil : 2;

    await usuarioService.create({
      nombreu: username,
      contrasena: password,
      idperfil,
      idpersona,
      estado: "Activo",
    });

    req.flash("success", "Registro exitoso. Ya puede ingresar.");
    return res.redirect("/login");
  }

  req.flash("success", "Persona guardada correctamente.");
  res.redirect("/personas");
}

async function update(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect(`/personas/${req.params.id}/editar`);
  }
  const ok = await personaService.update(req.params.id, req.body);
  if (!ok) req.flash("error", "No se pudo actualizar.");
  else req.flash("success", "Persona actualizada.");
  res.redirect("/personas");
}

async function disable(req, res) {
  await personaService.disable(req.params.id);
  req.flash("info", "Persona inhabilitada (borrado lógico).");
  res.redirect("/personas");
}

module.exports = { list, newForm, editForm, create, update, disable };
