USE ecoturismo_db;

INSERT INTO perfil (descripc, estado) VALUES
('Administrador','Activo'),
('Persona','Activo');

-- persona del admin
INSERT INTO persona (nom1, nom2, apel1, apel2, direccion, tele, movil, correo, fecha_nac, estado)
VALUES ('Admin', NULL, 'Sistema', NULL, 'N/A', NULL, NULL, 'admin@demo.com', '2000-01-01', 'Activo');

-- usuario admin: contraseña Admin123* (bcrypt)
-- hash generado con bcrypt 10 rounds
INSERT INTO usuario (nombreu, contrasena, idperfil, idpersona, estado)
VALUES ('admin', '$2b$10$j84Q.H/rdM3jincJJzet3eIK12hmOVVTOjqekddO6jVC5qGslz2IK', 1, 1, 'Activo');
