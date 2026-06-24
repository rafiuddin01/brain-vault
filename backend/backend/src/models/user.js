const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: true }, // optional for now
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifyCode: { type: DataTypes.STRING, allowNull: true },
  verifyCodeExpiresAt: { type: DataTypes.DATE, allowNull: true }
});

module.exports = User;
