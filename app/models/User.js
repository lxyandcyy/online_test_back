const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * 用户实体，对应用户表
 */

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        password: DataTypes.STRING(255),
        userType: DataTypes.ENUM("USER", "ADMIN"),
        /** 注册时间 */
        regTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "user",
    }
);

module.exports = User;
