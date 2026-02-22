const { validationResult } = require("express-validator");
const { validateLogin, findUserByUsernameOrEmail, setTemporaryPassword } = require("../services/auth.service");
const { sendMail } = require("../services/mailer");

function getLogin(req, res) {
  res.render("auth/login", { title: "Acceso al Sistema" });
}

async function postLogin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect("/login");
  }

  const { username, password } = req.body;
  const result = await validateLogin(username, password);

  if (!result.ok) {
    if (result.reason === "no_user") req.flash("error", "El usuario no se encuentra registrado.");
    else if (result.reason === "inactive") req.flash("error", "El usuario está inactivo.");
    else req.flash("error", "Contraseña incorrecta.");
    return res.redirect("/login");
  }

  req.session.user = result.user;
  req.flash("success", `Bienvenido, ${result.user.nombreu} (${result.user.perfil})`);
  res.redirect("/");
}

function logout(req, res) {
  req.session.destroy(() => res.redirect("/login"));
}

function getRecover(req, res) {
  res.render("auth/recover", { title: "Recuperar Usuario/Contraseña" });
}

function randomTempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789*_-";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function postRecover(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(e => e.msg).join(" "));
    return res.redirect("/recuperar");
  }

  const { value } = req.body;
  const user = await findUserByUsernameOrEmail(value);

  if (!user) {
    req.flash("error", "El usuario no se encuentra registrado.");
    return res.redirect("/recuperar");
  }

  if (user.estado !== "Activo") {
    req.flash("error", "El usuario está inactivo. Contacte al administrador.");
    return res.redirect("/recuperar");
  }

  const tempPass = randomTempPassword();
  await setTemporaryPassword(user.idusuario, tempPass);

  await sendMail({
    to: user.correo,
    subject: "Recuperación de acceso - Ecoturismo",
    html: `
      <h2>Recuperación de acceso</h2>
      <p>Su usuario y contraseña fue enviado al correo registrado.</p>
      <p><b>Usuario:</b> ${user.nombreu}</p>
      <p><b>Contraseña temporal:</b> ${tempPass}</p>
      <p>Recomendación: ingrese y cambie la contraseña.</p>
    `
  });

  req.flash("success", "Su usuario y contraseña fue enviado al correo registrado.");
  res.redirect("/login");
}

module.exports = {
  getLogin, postLogin, logout,
  getRecover, postRecover
};
