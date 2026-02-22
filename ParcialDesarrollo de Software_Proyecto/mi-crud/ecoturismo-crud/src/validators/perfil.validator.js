const { body } = require("express-validator");

const rules = [
  body("descripc").trim().notEmpty().withMessage("Descripción requerida."),
  body("estado").isIn(["Activo","Inactivo"]).withMessage("Estado inválido."),
];

module.exports = { rules };
