const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

sequelize.query;

class ExamPaper extends Model {}
ExamPaper.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        name: DataTypes.STRING(20),
        /** 外键引用, 学科id, 创建的用户 */
        // subjectId: DataTypes.INTEGER,
        // createUser: DataTypes.BIGINT
        /** 试卷的总分数，通过ExamPaper_Question表中的分数计算出来 */
        // paperScore: DataTypes.INTEGER,
        /** 考试时间倒计时 */
        countDown: DataTypes.INTEGER,
        createTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        /** 试卷发布时间 */
        startTime: DataTypes.DATE,
        /** 试卷截至时间 */
        endTime: DataTypes.DATE,
        isPublish: DataTypes.BOOLEAN,
    },
    {
        sequelize,
        tableName: "exam_paper",
        getterMethods: {
            /** 获取当前试卷的题目总分 */
            paperScore() {
                return this.getQuestions().then((res) => {
                    return res.reduce((acc, cur) => {
                        return (acc += cur.ExamPaper_Question.score);
                    }, 0);
                });
            },
        },
    }
);

module.exports = ExamPaper;
