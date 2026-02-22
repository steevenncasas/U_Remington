const bcrypt = require("bcryptjs");
const { pool } = require("../db/pool");

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    `SELECT u.idusuario, u.nombreu, u.contrasena, u.estado,
            p.correo, pr.descripc AS perfil
     FROM usuario u
     JOIN persona p ON p.idpersona = u.idpersona
     JOIN perfil pr ON pr.idperfil = u.idperfil
     WHERE u.nombreu = ? LIMIT 1`,
    [username]
  );
  return rows[0] || null;
}

async function findUserByUsernameOrEmail(value) {
  const [rows] = await pool.query(
    `SELECT u.idusuario, u.nombreu, u.contrasena, u.estado,
            p.correo, pr.descripc AS perfil
     FROM usuario u
     JOIN persona p ON p.idpersona = u.idpersona
     JOIN perfil pr ON pr.idperfil = u.idperfil
     WHERE u.nombreu = ? OR p.correo = ?
     LIMIT 1`,
    [value, value]
  );
  return rows[0] || null;
}

async function validateLogin(username, password) {
  const user = await findUserByUsername(username);
  if (!user) return { ok: false, reason: "no_user" };
  if (user.estado !== "Activo") return { ok: false, reason: "inactive" };

  const match = await bcrypt.compare(password, user.contrasena);
  if (!match) return { ok: false, reason: "bad_password" };

  return {
    ok: true,
    user: {
      idusuario: user.idusuario,
      nombreu: user.nombreu,
      perfil: user.perfil,
      correo: user.correo,
    },
  };
}

async function setTemporaryPassword(idusuario, tempPassword) {
  const hash = await bcrypt.hash(tempPassword, 10);
  await pool.query("UPDATE usuario SET contrasena = ? WHERE idusuario = ?", [hash, idusuario]);
}

module.exports = {
  validateLogin,
  findUserByUsernameOrEmail,
  setTemporaryPassword,
};
