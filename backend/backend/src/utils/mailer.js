// src/utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // helpful for dev when TLS issues happen; remove in prod
  tls: { rejectUnauthorized: false }
});

transporter.verify().then(() => {
  console.log('Mailer: SMTP connection OK');
}).catch(err => {
  console.error('Mailer verification failed:', err);
});

async function sendVerificationEmail(to, code) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify`;
  const html = `
    <p>Hello — your verification code is <b>${code}</b></p>
    <p>Or click to verify: <a href="${verifyUrl}?email=${encodeURIComponent(to)}&code=${code}">Verify</a></p>
    <p>This code expires in 30 minutes.</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'BrainVault - Email verification',
      html
    });
    console.log('Verification email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('sendVerificationEmail error:', err);
    throw err;
  }
}

module.exports = { sendVerificationEmail };
