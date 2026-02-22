const { pool } = require("../db/pool");

async function list() {
  const [rows] = await pool.query("SELECT * FROM perfil ORDER BY idperfil DESC");
  return rows;
}

async function get(id) {
  const [rows] = await pool.query("SELECT * FROM perfil WHERE idperfil = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function create({ descripc, estado }) {
  const [r] = await pool.query("INSERT INTO perfil(descripc, estado) VALUES(?,?)", [descripc, estado]);
  return r.insertId;
}

async function update(id, { descripc, estado }) {
  const [r] = await pool.query("UPDATE perfil SET descripc=?, estado=? WHERE idperfil=?", [descripc, estado, id]);
  return r.affectedRows > 0;
}

async function disable(id) {
  const [r] = await pool.query("UPDATE perfil SET estado='Inactivo' WHERE idperfil=?", [id]);
  return r.affectedRows > 0;
}

module.exports = { list, get, create, update, disable };
