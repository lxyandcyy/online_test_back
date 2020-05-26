const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * User 与 Question 的关联表    考试记录表
 */

class User_PracticePaper extends Model {}
User_PracticePaper.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 外键引用 */
        // userId: DataTypes.BIGINT,
        // practicePaperId: DataTypes.BIGINT
    },
    {
        sequelize,
        tableName: "user__practice_paper",
        // timestamps: true,
    }
);

module.exports = User_PracticePaper;
