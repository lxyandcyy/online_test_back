const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class ExamPaper extends Model {}
ExamPaper.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
        },
        name: DataTypes.STRING(20),
        subjectId: DataTypes.INTEGER,
        gradeLevel: DataTypes.INTEGER,
        paperScore: DataTypes.INTEGER,
        questionCount: DataTypes.INTEGER,
        countDown: DataTypes.INTEGER,
        frameTextContentId: DataTypes.INTEGER,
        createUser: DataTypes.STRING(20),
        createTime: DataTypes.STRING(20),
        deleted: DataTypes.INTEGER,
        taskExamId: DataTypes.INTEGER,
        endTime: DataTypes.STRING(20),
        startTime: DataTypes.STRING(20),
    },
    {
        sequelize,
        tableName: "exam_paper",
    }
);

module.exports = ExamPaper;
