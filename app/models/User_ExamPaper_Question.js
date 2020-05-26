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
        // questionId: DataTypes.BIGINT,
        // user_ExamPaperId: DataTypes.BIGINT,
        // optionId: DataTypes.BIGINT,
        /** 题目是否做正确 */
        correct: DataTypes.BOOLEAN,
    },
    {
        sequelize,
        tableName: "user_examPaper_que",
    }
);

module.exports = User_ExamPaper_Question;
