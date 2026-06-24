const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  fileName: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  }

}, {
  tableName: 'notes',
  timestamps: true,
});

module.exports = Note;