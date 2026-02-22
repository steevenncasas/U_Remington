const express = require("express");
const router = express.Router();

const { loginRules, recoverRules } = require("../validators/auth.validator");
const auth = require("../controllers/auth.controller");

router.get("/login", auth.getLogin);
router.post("/login", loginRules, auth.postLogin);
router.get("/logout", auth.logout);

router.get("/recuperar", auth.getRecover);
router.post("/recuperar", recoverRules, auth.postRecover);

router.get("/register", (req, res) => res.redirect("/personas/nuevo?register=1"));

module.exports = router;
