// src/controllers/authController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

async function registerStart(req, res) {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 30 * 60 * 1000);

    await User.create({ name, email, verifyCode: code, verifyCodeExpiresAt: expire, isVerified: false });

    try {
      await sendVerificationEmail(email, code);
    } catch (err) {
      console.error('Mail send failed (non-fatal):', err);
    }

    return res.json({ message: 'Verification code generated and sent if possible.' });
  } catch (err) {
    console.error('registerStart ERR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function verifyCode(req, res) {
  try {
    const { email, code, password } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });
    if (user.verifyCode !== code) return res.status(400).json({ message: 'Invalid code' });
    if (new Date() > new Date(user.verifyCodeExpiresAt)) return res.status(400).json({ message: 'Code expired' });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    user.isVerified = true;
    user.verifyCode = null;
    user.verifyCodeExpiresAt = null;
    await user.save();

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ message: 'Verified', token });
  } catch (err) {
    console.error('verifyCode ERR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(401).json({ message: 'Email not verified' });

    const valid = await bcrypt.compare(password, user.passwordHash || '');
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token });
  } catch (err) {
    console.error('login ERR:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  registerStart,
  verifyCode,
  login
};
