const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/auth");
const ctrl = require("../controllers/persona.controller");
const { rules } = require("../validators/persona.validator");

router.get("/", requireAuth, ctrl.list);
router.get("/nuevo", (req, res, next) => {
  // Permitir registro sin autenticación
  if (String(req.query.register || "0") === "1") return next();
  return requireAuth(req, res, next);
}, ctrl.newForm);

router.get("/:id/editar", requireAuth, ctrl.editForm);

router.post("/", (req, res, next) => {
  if (String(req.query.register || "0") === "1") return next();
  return requireAuth(req, res, next);
}, rules, ctrl.create);

router.put("/:id", requireAuth, rules, ctrl.update);
router.post("/:id/inhabilitar", requireAuth, ctrl.disable);

module.exports = router;
