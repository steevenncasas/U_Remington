const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/auth");
const { dashboard } = require("../controllers/dashboard.controller");

router.get("/", requireAuth, dashboard);

module.exports = router;
