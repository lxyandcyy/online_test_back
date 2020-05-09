const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * ExamPaper 与 Question 的关联表
 */

class ExamPaper_Question extends Model {}
ExamPaper_Question.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 每个试卷 题目的分数 */
        score: DataTypes.INTEGER,
        /** 外键引用 */
        // questionId: DataTypes.BIGINT,
        // examPaperId: DataTypes.BIGINT
    },
    {
        sequelize,
        tableName: "exam_paper__question",
        // timestamps: true,
    }
);

module.exports = ExamPaper_Question;
