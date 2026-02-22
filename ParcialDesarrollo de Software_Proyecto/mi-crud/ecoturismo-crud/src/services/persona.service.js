const { pool } = require("../db/pool");

async function list() {
  const [rows] = await pool.query("SELECT * FROM persona ORDER BY idpersona DESC");
  return rows;
}

async function get(id) {
  const [rows] = await pool.query("SELECT * FROM persona WHERE idpersona = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function create(data) {
  const {
    nom1, nom2, apel1, apel2, direccion, tele, movil, correo, fecha_nac, estado
  } = data;

  const [r] = await pool.query(
    `INSERT INTO persona(nom1, nom2, apel1, apel2, direccion, tele, movil, correo, fecha_nac, estado)
     VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [nom1, nom2 || null, apel1, apel2 || null, direccion || null, tele || null, movil || null, correo, fecha_nac || null, estado]
  );
  return r.insertId;
}

async function update(id, data) {
  const {
    nom1, nom2, apel1, apel2, direccion, tele, movil, correo, fecha_nac, estado
  } = data;

  const [r] = await pool.query(
    `UPDATE persona SET nom1=?, nom2=?, apel1=?, apel2=?, direccion=?, tele=?, movil=?, correo=?, fecha_nac=?, estado=?
     WHERE idpersona=?`,
    [nom1, nom2 || null, apel1, apel2 || null, direccion || null, tele || null, movil || null, correo, fecha_nac || null, estado, id]
  );
  return r.affectedRows > 0;
}

async function disable(id) {
  const [r] = await pool.query("UPDATE persona SET estado='Inactivo' WHERE idpersona=?", [id]);
  return r.affectedRows > 0;
}

module.exports = { list, get, create, update, disable };
