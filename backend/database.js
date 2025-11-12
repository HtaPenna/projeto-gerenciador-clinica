require("dotenv").config();
const Sequelize = require('sequelize');


const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    host: process.env.MYSQLHOST_PUBLIC,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;