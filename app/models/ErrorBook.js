const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * User 与 Question 的关联表    考试记录表
 */

class ErrorBook extends Model {}
User_ExamPaper.init(
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
