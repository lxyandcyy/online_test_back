/**
 * 以下部分为数据库配置， 连接数据库
 */

const { Sequelize, DataTypes } = require("sequelize");

var DBconfig = {
    database: "testonline",
    username: "root",
    password: "921680",
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
        timezone: "+08:00",
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
