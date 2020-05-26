const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * User 与 Question 的关联表    错题表
 */

class ErrorBook extends Model {}
ErrorBook.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 外键引用 */
        // userId: DataTypes.BIGINT,
        // questionId: DataTypes.BIGINT
    },
    {
        sequelize,
        tableName: "errorBook",
        // timestamps: true,
    }
);

module.exports = ErrorBook;
