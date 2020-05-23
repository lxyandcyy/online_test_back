var Module = require("../models/Models");
const Op = require("sequelize").Op;

class User_ExamPaper {
    constructor() {}

    // TODO：查找所有考试记录
    static async findRecords(userId) {
        console.log(userId);
        const records = await Module.User_ExamPaper.findAll({
            where: {
                userId: userId,
            },
        });
        return records;
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
