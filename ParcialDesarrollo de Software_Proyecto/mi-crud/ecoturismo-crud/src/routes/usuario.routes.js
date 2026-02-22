const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middlewares/auth");
const ctrl = require("../controllers/usuario.controller");
const { createRules, updateRules } = require("../validators/usuario.validator");

router.get("/", requireAdmin, ctrl.list);
router.get("/nuevo", requireAdmin, ctrl.newForm);
router.get("/:id/editar", requireAdmin, ctrl.editForm);

router.post("/", requireAdmin, createRules, ctrl.create);
router.put("/:id", requireAdmin, updateRules, ctrl.update);
router.post("/:id/inhabilitar", requireAdmin, ctrl.disable);

module.exports = router;
