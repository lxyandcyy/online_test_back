const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class User_ExamPaper_Question extends Model {}

User_ExamPaper_Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 外键 */
        // userId: DataTypes.BIGINT,
        // examPaper_QuestionId: DataTypes.BIGINT,
        /** 题目是否做正确 */
        correct: DataTypes.BOOLEAN,
        /** 做题时间 */
        // TODO: 移到新表 User_ExamPaper
        doTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: "user__question__exam_paper",
    }
);

module.exports = User_ExamPaper_Question;
