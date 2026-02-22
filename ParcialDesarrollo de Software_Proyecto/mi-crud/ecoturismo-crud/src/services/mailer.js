const nodemailer = require("nodemailer");
const { env } = require("../config/env");

function isConfigured() {
  return !!(env.smtp.host && env.smtp.user && env.smtp.pass);
}

async function sendMail({ to, subject, html }) {
  if (!isConfigured()) {
    // Para que no se caiga si no configuras SMTP aún
    console.log("[SMTP NO CONFIGURADO] Simulando envío a:", to);
    console.log("Subject:", subject);
    console.log("Body:", html.replace(/<[^>]+>/g, ""));
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });

  const info = await transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });

  return info;
}

module.exports = { sendMail };
