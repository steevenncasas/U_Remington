const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");
const methodOverride = require("method-override");
const { env } = require("./config/env");

const { globals } = require("./middlewares/globals");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const perfilRoutes = require("./routes/perfil.routes");
const personaRoutes = require("./routes/persona.routes");
const usuarioRoutes = require("./routes/usuario.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(morgan("dev"));

app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(flash());
app.use(globals);

// Rutas
app.use(authRoutes);
app.use(dashboardRoutes);
app.use("/perfiles", perfilRoutes);
app.use("/personas", personaRoutes);
app.use("/usuarios", usuarioRoutes);

// 404
app.use((req, res) => res.status(404).send("Ruta no encontrada"));

module.exports = { app };
