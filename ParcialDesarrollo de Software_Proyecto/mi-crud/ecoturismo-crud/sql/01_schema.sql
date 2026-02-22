CREATE DATABASE IF NOT EXISTS ecoturismo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoturismo_db;

DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS persona;
DROP TABLE IF EXISTS perfil;

CREATE TABLE perfil (
  idperfil INT AUTO_INCREMENT PRIMARY KEY,
  descripc VARCHAR(80) NOT NULL,
  estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo'
);

CREATE TABLE persona (
  idpersona INT AUTO_INCREMENT PRIMARY KEY,
  nom1 VARCHAR(60) NOT NULL,
  nom2 VARCHAR(60) NULL,
  apel1 VARCHAR(60) NOT NULL,
  apel2 VARCHAR(60) NULL,
  direccion VARCHAR(120) NULL,
  tele VARCHAR(20) NULL,
  movil VARCHAR(20) NULL,
  correo VARCHAR(120) NOT NULL,
  fecha_nac DATE NULL,
  estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  UNIQUE KEY uq_persona_correo (correo)
);

CREATE TABLE usuario (
  idusuario INT AUTO_INCREMENT PRIMARY KEY,
  nombreu VARCHAR(60) NOT NULL,
  contrasena VARCHAR(255) NOT NULL,
  idperfil INT NOT NULL,
  idpersona INT NOT NULL,
  estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
  UNIQUE KEY uq_usuario_nombreu (nombreu),
  UNIQUE KEY uq_usuario_idpersona (idpersona),
  CONSTRAINT fk_usuario_perfil FOREIGN KEY (idperfil) REFERENCES perfil(idperfil),
  CONSTRAINT fk_usuario_persona FOREIGN KEY (idpersona) REFERENCES persona(idpersona)
);
