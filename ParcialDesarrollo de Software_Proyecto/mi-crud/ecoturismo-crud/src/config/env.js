const dotenv = require("dotenv");
dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta variable de entorno: ${name}`);
  return v;
}

module.exports = {
  env: {
    port: Number(process.env.PORT || 3000),
    sessionSecret: process.env.SESSION_SECRET || "dev_secret_change_me",
    db: {
      host: required("DB_HOST"),
      user: required("DB_USER"),
      password: process.env.DB_PASSWORD || "",
      database: required("DB_NAME"),
      port: Number(process.env.DB_PORT || 3306),
    },
    smtp: {
      host: process.env.SMTP_HOST || "",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
      from: process.env.SMTP_FROM || "no-reply@example.com",
    },
  },
};
