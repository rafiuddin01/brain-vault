const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB ok');

    await sequelize.sync();

    app.listen(PORT, () =>
      console.log('Server running on', PORT)
    );

  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();