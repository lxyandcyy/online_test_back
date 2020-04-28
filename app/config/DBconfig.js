/**
 * 以下部分为数据库配置， 连接数据库
 */

const Sequelize = require("sequelize");

var DBconfig = {
    database: "test_online",
    username: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    sync: false,
};

var sequelize = new Sequelize(
    DBconfig.database,
    DBconfig.username,
    DBconfig.password,
    {
        host: DBconfig.host,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 30000,
        },
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
        },
    }
);

sequelize
    .authenticate()
    .then(() => {
        console.log("成功连接至数据库");
    })
    .catch((err) => {
        console.error("无法连接数据库， 错误：", err);
    });

/** 表同步设置 */
sequelize.sync({ force: DBconfig.sync });

module.exports = sequelize;
