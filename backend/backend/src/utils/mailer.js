// src/utils/mailer.js

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function sendVerificationEmail(to, code) {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify`;

  const html = `
    <h2>BrainVault Email Verification</h2>
    <p>Hello,</p>

    <p>Your verification code is:</p>

    <h1 style="letter-spacing:3px;">${code}</h1>

    <p>Or click the link below to verify your account:</p>

    <p>
      <a href="${verifyUrl}?email=${encodeURIComponent(
        to
      )}&code=${code}">
        Verify Email
      </a>
    </p>

    <p>This code expires in <strong>30 minutes</strong>.</p>

    <p>Thank you,<br>BrainVault Team</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"BrainVault" <${process.env.EMAIL_USER}>`,
      to,
      subject: "BrainVault - Email Verification",
      html,
    });

    console.log("Verification email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("sendVerificationEmail error:", err);
    throw err;
  }
}

module.exports = { sendVerificationEmail };