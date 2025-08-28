const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodeproject", "root", "1234", {
  host: "127.0.0.1",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3,
  },
  logging: false, // Disable SQL logging to reduce noise
});

module.exports = sequelize;
