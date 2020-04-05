const Sequelize = require("sequelize");
const config = require("./config");

// 创建一个sequelize对象实例
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,

  {
    host: config.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
    },
  }
);

// 定义模型 UserInfo，告诉Sequelize如何映射数据库表
// 对应表： user_info
const UserInfo = sequelize.define(
  "user_info",
  {
    user_id: {
      type: Sequelize.STRING(20),
      primaryKey: true,
    },
    password: Sequelize.STRING(20),
    user_type: Sequelize.STRING(20),
    reg_time: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = { UserInfo };
