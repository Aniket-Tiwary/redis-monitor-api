const Sequelize = require("sequelize");
// imports the sqlite DB
const db = require("../config/database");

// defines the schema of RedisInfo table
const RedisInfo = db.define(
  "RedisInfo",
  {
    md5: { type: Sequelize.STRING(32), primaryKey: true },
    host: { type: Sequelize.STRING(32) },
    port: { type: Sequelize.INTEGER, defaultValue: 6379 },
    password: { type: Sequelize.STRING(32) },
    add_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  },
  { tableName: "RedisInfo", timestamps: false }
);

module.exports = RedisInfo;
