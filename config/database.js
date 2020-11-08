// requiring the sequelize constructor
const Sequelize = require("sequelize");

// creating a new sqlite DB
module.exports = new Sequelize("sqlite://rm.db");
