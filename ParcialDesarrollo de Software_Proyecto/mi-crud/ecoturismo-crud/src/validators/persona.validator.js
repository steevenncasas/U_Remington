const { body } = require("express-validator");

const rules = [
  body("nom1").trim().notEmpty().withMessage("Primer nombre requerido."),
  body("apel1").trim().notEmpty().withMessage("Primer apellido requerido."),
  body("correo").trim().isEmail().withMessage("Correo inválido."),
  body("estado").isIn(["Activo","Inactivo"]).withMessage("Estado inválido."),
];

module.exports = { rules };
