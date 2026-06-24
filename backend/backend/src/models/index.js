const sequelize = require('../config/db');
const User = require('./user');
const Note = require('./note');


module.exports = {
  sequelize,
  User,
  Note
};
