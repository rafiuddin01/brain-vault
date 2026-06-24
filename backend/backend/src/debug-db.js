// src/debug-db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

(async () => {
  try {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false
    });

    await sequelize.authenticate();
    console.log('✅ Sequelize authenticated');

    // show tables
    const [results] = await sequelize.query("SHOW TABLES");
    console.log('Tables:', results);

    // try simple query
    const [one] = await sequelize.query("SELECT 1+1 AS solution");
    console.log('Test query result:', one);

    await sequelize.close();
  } catch (err) {
    console.error('DB debug error:', err);
  }
})();
