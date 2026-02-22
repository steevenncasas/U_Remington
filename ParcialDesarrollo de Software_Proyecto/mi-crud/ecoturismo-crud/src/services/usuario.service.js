const bcrypt = require("bcryptjs");
const { pool } = require("../db/pool");

async function list() {
  const [rows] = await pool.query(
    `SELECT u.idusuario, u.nombreu, u.contrasena, u.estado,
            u.idperfil, pr.descripc AS perfil,
            u.idpersona, CONCAT(p.nom1,' ',p.apel1) AS persona
     FROM usuario u
     JOIN perfil pr ON pr.idperfil = u.idperfil
     JOIN persona p ON p.idpersona = u.idpersona
     ORDER BY u.idusuario DESC`
  );
  return rows;
}

async function get(id) {
  const [rows] = await pool.query("SELECT * FROM usuario WHERE idusuario=? LIMIT 1", [id]);
  return rows[0] || null;
}

// ✅ Helper: valida que una persona NO tenga ya usuario (o permite el mismo si estás editando)
async function assertPersonaDisponible(idpersona, ignoreUserId = null) {
  const [rows] = await pool.query(
    `SELECT idusuario FROM usuario
     WHERE idpersona = ?
     ${ignoreUserId ? "AND idusuario <> ?" : ""}
     LIMIT 1`,
    ignoreUserId ? [idpersona, ignoreUserId] : [idpersona]
  );

  if (rows.length > 0) {
    const e = new Error("La persona seleccionada ya tiene un usuario registrado.");
    e.code = "PERSONA_YA_TIENE_USUARIO";
    throw e;
  }
}

async function create({ nombreu, contrasena, idperfil, idpersona, estado }) {
  // ✅ Validación previa (para dar mensaje bonito)
  await assertPersonaDisponible(idpersona);

  const hash = await bcrypt.hash(contrasena, 10);

  try {
    const [r] = await pool.query(
      `INSERT INTO usuario(nombreu, contrasena, idperfil, idpersona, estado)
       VALUES(?,?,?,?,?)`,
      [nombreu, hash, idperfil, idpersona, estado]
    );
    return r.insertId;
  } catch (err) {
    // ✅ Por si dos crean al mismo tiempo: la BD manda duplicado
    if (err.code === "ER_DUP_ENTRY" && String(err.message).includes("idpersona")) {
      const e = new Error("La persona seleccionada ya tiene un usuario registrado.");
      e.code = "PERSONA_YA_TIENE_USUARIO";
      throw e;
    }
    throw err;
  }
}

async function update(id, { nombreu, contrasena, idperfil, idpersona, estado }) {
  // ✅ Si cambian la persona, validar que esa persona no esté usada por OTRO usuario
  await assertPersonaDisponible(idpersona, id);

  // si no envían contraseña, no la toca
  if (contrasena && contrasena.trim() !== "") {
    const hash = await bcrypt.hash(contrasena, 10);
    const [r] = await pool.query(
      `UPDATE usuario
       SET nombreu=?, contrasena=?, idperfil=?, idpersona=?, estado=?
       WHERE idusuario=?`,
      [nombreu, hash, idperfil, idpersona, estado, id]
    );
    return r.affectedRows > 0;
  }

  const [r] = await pool.query(
    `UPDATE usuario
     SET nombreu=?, idperfil=?, idpersona=?, estado=?
     WHERE idusuario=?`,
    [nombreu, idperfil, idpersona, estado, id]
  );
  return r.affectedRows > 0;
}

async function disable(id) {
  const [r] = await pool.query("UPDATE usuario SET estado='Inactivo' WHERE idusuario=?", [id]);
  return r.affectedRows > 0;
}

async function listPerfilesActivos() {
  const [rows] = await pool.query(
    "SELECT idperfil, descripc FROM perfil WHERE estado='Activo' ORDER BY descripc"
  );
  return rows;
}

// ✅ Mejor UX: solo personas activas que NO tengan usuario
async function listPersonasActivas() {
  const [rows] = await pool.query(
    `SELECT p.idpersona, CONCAT(p.nom1,' ',p.apel1,' (',p.correo,')') AS label
     FROM persona p
     LEFT JOIN usuario u ON u.idpersona = p.idpersona
     WHERE p.estado='Activo' AND u.idpersona IS NULL
     ORDER BY p.idpersona DESC`
  );
  return rows;
}

module.exports = {
  list, get, create, update, disable,
  listPerfilesActivos, listPersonasActivas
};