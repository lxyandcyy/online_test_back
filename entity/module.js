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

// 定义模型 T_Question
// 对应表： t_question
const T_Question = sequelize.define(
  "t_question",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    subject_id: Sequelize.INTEGER,
    difficult: Sequelize.INTEGER,
    correct: Sequelize.STRING(20),
    create_user: Sequelize.STRING(20),
    create_time: Sequelize.STRING(20),
    topic: Sequelize.STRING(20),
    parse: Sequelize.STRING(20),
    options: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = { UserInfo, T_Question };
