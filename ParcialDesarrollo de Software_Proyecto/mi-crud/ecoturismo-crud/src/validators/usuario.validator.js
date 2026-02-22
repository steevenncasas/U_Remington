const { body } = require("express-validator");

const createRules = [
  body("nombreu").trim().notEmpty().withMessage("Nombre de usuario requerido."),
  body("contrasena").trim().notEmpty().withMessage("Contraseña requerida."),
  body("idperfil").isInt().withMessage("Perfil inválido."),
  body("idpersona").isInt().withMessage("Persona inválida."),
  body("estado").isIn(["Activo","Inactivo"]).withMessage("Estado inválido."),
];

const updateRules = [
  body("nombreu").trim().notEmpty().withMessage("Nombre de usuario requerido."),
  body("idperfil").isInt().withMessage("Perfil inválido."),
  body("idpersona").isInt().withMessage("Persona inválida."),
  body("estado").isIn(["Activo","Inactivo"]).withMessage("Estado inválido."),
  // contraseña opcional en edición
];

module.exports = { createRules, updateRules };
