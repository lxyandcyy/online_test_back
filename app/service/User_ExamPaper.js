var Module = require("../models/Models");
const Op = require("sequelize").Op;

class User_ExamPaper {
    constructor() {}

    // TODO：查找所有考试记录
    /**
     * @param {{userId: Number, examPaperId: Number}} params 用户id和examPaperId
     * @returns {Promise<any>}
     */
    static async findRecord(params) {
        const { examPaperId, userId } = params;

        /* 找出该试卷的所有试题 */
        const currentExamPaper = await Module.ExamPaper.findByPk(examPaperId, {
            include: {
                model: Module.Question,
                include: {
                    model: Module.Option,
                },
            },
        });
        const allQuestions = currentExamPaper.get({ plain: true }).Questions;
        const paperScore = await currentExamPaper.paperScore;

        const allQuestionMap = {};
        allQuestions.map((item, index) => {
            allQuestionMap[item.id] = index;
            item.score = item.ExamPaper_Question.score;
            delete item.ExamPaper_Question;
        });

        const res = await Module.User_ExamPaper.findOne({
            where: {
                examPaperId,
                userId,
            },
            include: {
                model: Module.Question,
            },
        });
        const data = res.get({ plain: true });
        /* 用户做题的记录 */
        const records = data.Questions;
        for (let i = 0; i < records.length; i++) {
            const { OptionId, correct } = records[i].User_ExamPaper_Question;
            /* 通过题目的id查找对应的index，添加到属性里去 */
            const index = allQuestionMap[records[i].id];
            if (index !== undefined) {
                allQuestions[index].status = {
                    OptionId,
                    correct,
                };
            } else {
                allQuestions[index].status = null;
            }
        }

        const examPaper = currentExamPaper.get({ plain: true });
        delete examPaper.Questions;
        examPaper.paperScore = paperScore;
        return {
            examPaper,
            records: allQuestions,
        };
    }

    /**
     * 判断用户是否做过此试卷
     * @param userId 用户id
     * @param examPaperId 试卷id
     * @returns {Promise<Boolean>} 用户是否做了该试卷
     */
    static async isUserDidExamPaper(userId, examPaperId) {
        return !!Module.User_ExamPaper.findOne({
            where: {
                userId,
                examPaperId,
            },
        });
    }
    /**
     * TODO：提交答题卡
     * @typedef {Object} QuestionRecord 返回的题目记录
     * @property {Boolean} correct 是否做正确
     * @property {Number} OptionId 选项的Id
     * @property {Number} questionId 题目的Id
     *
     * 做题信息
     * @param {{
     *    userId: Number, examPaperId: Number, spendTime: Number,
     *    options: [
     *     {
     *       optionId: Number,
     *       questionId: Number
     *     }]
     * }} data 传入的做题信息，需要userId, examPaperId, spendTime以及做题的选项options作为数据
     * 数据格式
     * @returns { Promise<QuestionRecord> }
     */
    static async submitExamPaper(data) {
        if (this.isUserDidExamPaper(data.userId, data.examPaperId)) {
            throw new Error("用户已经做过该试题");
        }
        /* 每道题的选项映射，通过此数据结构能够更快查询到某题目的选项 */
        const allOptions = data.options.reduce((map, item) => {
            map[item.questionId] = item.optionId;
            return map;
        }, {});
        const allQuestion = data.options.map((item) => item.questionId);
        /* 找出所有的题目，包含题目的选项，同时找出 */
        const questions = await Module.Question.findAll({
            where: {
                id: {
                    [Op.in]: allQuestion,
                },
            },
            include: Module.Option,
        });

        /** 题目的总分 */
        let totalScore = 0;
        /** 做题记录 */
        const questionRecord = [];

        /* 找到所有题目对应的分数 */
        const scoreRecord = await Module.ExamPaper_Question.findAll({
            where: {
                examPaperId: data.examPaperId,
                questionId: {
                    [Op.in]: allQuestion,
                },
            },
        });
        const scoreMap = scoreRecord.reduce((map, item) => {
            map[item.questionId] = item.score;
            return map;
        }, {});
        /* 对每一道题目进行判断 */
        for (let i = 0; i < questions.length; i++) {
            const item = questions[i];
            /* 在本题目的选项中查找正确选项 */
            const optionIndex = item.Options.findIndex((option) => {
                return option.id === allOptions[item.id];
            });

            /* 找到题目答案是否正确 */
            let isCorrect;
            if (optionIndex === -1) {
                isCorrect = false;
            } else {
                isCorrect = item.Options[optionIndex].isCorrect;
            }
            /* 计算总分 */
            if (isCorrect) {
                totalScore += scoreMap[item.id];
            }
            questionRecord.push({
                correct: isCorrect,
                questionId: item.id,
                OptionId:
                    optionIndex === -1 ? null : item.Options[optionIndex].id,
            });
        }

        const userExamPaper = await Module.User_ExamPaper.create({
            userId: data.userId,
            examPaperId: data.examPaperId,
            doTime: new Date(),
            spendTime: data.spendTime,
            userScore: totalScore,
        });

        await Module.User_ExamPaper_Question.bulkCreate(
            questionRecord.map((item) => {
                return Object.assign({}, item, {
                    user_ExamPaperId: userExamPaper.id,
                });
            })
        );
        return {
            score: totalScore,
            records: questionRecord,
        };
    }
}

module.exports = User_ExamPaper;
