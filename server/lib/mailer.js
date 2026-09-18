const nodemailer = require('nodemailer')

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null

async function sendMail({ to, subject, text }) {
  if (!transporter) {
    console.log(`[mailer] SMTP not configured — would send to ${to}\nSubject: ${subject}\n${text}`)
    return
  }
  await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@ghe.edu.au', to, subject, text })
}

module.exports = { sendMail }
