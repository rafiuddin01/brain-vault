// src/routes/auth.js
const express = require('express');
const router = express.Router();

const { registerStart, verifyCode, login } = require('../controllers/authController');

if (typeof registerStart !== 'function' ||
    typeof verifyCode !== 'function' ||
    typeof login !== 'function') {
  console.error('authController exports are invalid:', {
    registerStartType: typeof registerStart,
    verifyCodeType: typeof verifyCode,
    loginType: typeof login
  });
}

router.post('/register', registerStart);
router.post('/verify', verifyCode);
router.post('/login', login);

module.exports = router;
