const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class User_Question_ExamPaper extends Model {}

User_Question_ExamPaper.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        questionId: Sequelize.INTEGER,
        examPaperId: Sequelize.INTEGER,
        examPaperAnswerId: Sequelize.INTEGER,
        questionType: Sequelize.INTEGER,
        subjectId: Sequelize.INTEGER,
        customerScore: Sequelize.INTEGER,
        questionScore: Sequelize.INTEGER,
        questionTextContentId: Sequelize.INTEGER,
        doRight: Sequelize.STRING(20),
        doUser: Sequelize.STRING(20),
        doTime: Sequelize.STRING(20),
        itemOrder: Sequelize.INTEGER,
    },
    {
        sequelize,
        tableName: "user__question__exam_paper",
    }
);

module.exports = User_Question_ExamPaper;
