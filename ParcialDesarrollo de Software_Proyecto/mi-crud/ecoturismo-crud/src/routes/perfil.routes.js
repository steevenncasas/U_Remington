const express = require("express");
const router = express.Router();

const { requireAdmin } = require("../middlewares/auth");
const ctrl = require("../controllers/perfil.controller");
const { rules } = require("../validators/perfil.validator");

router.get("/", requireAdmin, ctrl.list);
router.get("/nuevo", requireAdmin, ctrl.newForm);
router.get("/:id/editar", requireAdmin, ctrl.editForm);

router.post("/", requireAdmin, rules, ctrl.create);
router.put("/:id", requireAdmin, rules, ctrl.update);
router.post("/:id/inhabilitar", requireAdmin, ctrl.disable);

module.exports = router;
