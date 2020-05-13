const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * User 与 Question 的关联表    考试记录表
 */

class User_ExamPaper extends Model {}
User_ExamPaper.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 某一试卷 用户总分 */
        userScore: DataTypes.INTEGER,
        /** 外键引用 */
        // userId: DataTypes.BIGINT,
        // examPaperId: DataTypes.BIGINT
        doTime: DataTypes.DATE,
        spendTime: DataTypes.INTEGER,
    },
    {
        sequelize,
        tableName: "user__exam_paper",
        // timestamps: true,
    }
);

module.exports = User_ExamPaper;
