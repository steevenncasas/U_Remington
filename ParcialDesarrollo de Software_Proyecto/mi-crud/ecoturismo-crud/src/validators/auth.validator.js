const { body } = require("express-validator");

const loginRules = [
  body("username").trim().notEmpty().withMessage("El usuario es obligatorio."),
  body("password").trim().notEmpty().withMessage("La contraseña es obligatoria."),
];

const recoverRules = [
  body("value").trim().notEmpty().withMessage("Digite usuario o correo."),
];

module.exports = { loginRules, recoverRules };
