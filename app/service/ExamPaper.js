var Module = require("../models/Models");
let Service = require("../service/Service");
let TimeConverse = require("../util/timeConverse.js");
const Op = require("sequelize").Op;

class ExamPaper {
    constructor() {}
    /**
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
    static async doExamPaper(data) {
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
                OptionId: item.Options[optionIndex].id,
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

    // TODO：查找所有试卷
    static async findPapers(condition) {
        const examPapers = await Module.ExamPaper.findAll({
            where: condition,
        });
        return examPapers;
    }

    // TODO: 查找单个试卷详细内容
    static async findPaper(condition) {
        const examPaper = await Module.ExamPaper.findOne({
            where: condition,
        });

        let examPaper_question = await Module.ExamPaper_Question.findAll({
            where: { examPaperId: examPaper.id },
        });
        return [examPaper, examPaper_question];
    }

    // TODO：新增试卷
    static async addPaper(reqBody) {
        let examPaper = await Module.ExamPaper.create({
            ...reqBody,
            createTime: TimeConverse.timestampToDate(Date.now()),
        });
        const records = reqBody.questions.map((question) => {
            const res = {};
            res.examPaperId = examPaper.id;
            res.questionId = question.id;
            res.score = question.score;
            return res;
        });
        await Module.ExamPaper_Question.bulkCreate(records);

        return [examPaper.get({ plain: true }), records];
    }

    //TODO: 发布试卷
    static async publishPaper(condition, reqBody) {
        let count = await Module.ExamPaper.update(
            {
                ...reqBody,
                startTime: TimeConverse.timestampToDate(Date.now()),
            },
            {
                where: condition,
            }
        );
        return count;
    }

    // TODO: 更新试卷
    static async updatePaper(condition, reqBody) {
        await ExamPaper.destoryPaper(condition);
        let examPaper = await ExamPaper.addPaper(reqBody);
        return examPaper;
    }

    // TODO: 删除试卷
    static async destoryPaper(condition) {
        const examPaper = await Module.ExamPaper.findOne({ where: condition });
        const destroyCount = await Module.ExamPaper.destroy({
            where: condition,
        });
        return [destroyCount, examPaper];
    }

    //TODO：保存答题卡数据
    static async saveAnswerSheet(reqBody) {
        let user_examPaper = await Module.User_ExamPaper.create({
            ...reqBody,
            doTime: TimeConverse.timestampToDate(Date.now()),
        });

        const records = reqBody.questions.map((question) => {
            const res = {};
            res.user_ExamPaperId = user_examPaper.id;
            res.questionId = question.id;
            res.OptionId = question.OptionId;
            return res;
        });
        let user_examPaper_question = await Module.User_ExamPaper_Question.bulkCreate(
            records
        );

        return [user_examPaper, user_examPaper_question];
    }

    static async calculateUserScore2(userId, examPaperId, questions) {
        const user_ExamPaper = await Module.User_ExamPaper.findOne({
            where: {
                [Op.and]: {
                    userId: userId,
                    examPaperId: examPaperId,
                },
            },
        });
        const user_ExamPaperId = user_ExamPaper.id;

        const records = await Module.User_ExamPaper_Question.findAll({
            where: {
                user_ExamPaperId: user_ExamPaperId,
            },
        });

        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            let question = await Service.Question.findQuestion({
                id: questions[i].id,
            });
            console.log(question.getOptions());
        }

        // for (let i = 0; i < records.length; i++) {
        // 找出该题目的选项id
        // const questionId = records[i].questionId;
        // const option = questions.find((item) => {
        //     return item.id === questionId;
        // });
        // const optionId = option ? option.OptionId : null;
        //
        // console.log(records[i]);
        // // const options = await (
        //     await records[i].getQuestion()
        // ).getOptions();
        // const isCorrect = options.find((item) => item.id === optionId)
        //     .isCorrect;
        // console.log(i + "," + isCorrect);
        //
        // records[i].correct = isCorrect;
        // if (isCorrect) {
        //     score += (
        //         await Module.ExamPaper_Question.findOne({
        //             where: {
        //                 [Op.and]: {
        //                     examPaperId: examPaperId,
        //                     questionId: questions,
        //                 },
        //             },
        //         })
        //     ).score;
        // }
        // await records[i].save();
        // }
        // user_ExamPaper.userScore = score;
        // await user_ExamPaper.save();
        // return score;
    }

    static async caculateUserScore(user_examPaper) {
        // TODO: 判断每道题做的是否正确，存到correct字段
        // user_examPaper.getQuestions().forEach((item) => {
        //     console.log(item);
        // });

        // reqBody.questions.forEach((item) => {
        //     let map = []; //一道题的选项映射
        //     for (let i = 0; i < item.options.length; i++) {
        //         map.push({ i: item.options[i].prefix });
        //     }
        //     // 比对答案
        //     if (item.corrent === map[item.current_option]) {
        //         item.doRight = true; //用户本题正确
        //         item.score = 10; //item.question_score;//用户本题得分。。。。待修改
        //     } else {
        //         item.doRight = false; //用户本题错误
        //         item.score = 0;
        //     }
        //
        //     (async () => {
        //         // 新增考试记录
        //         let T_Exam_Paper_Question_Custom_Answer = await Module.User_ExamPaper_Question.create(
        //           {
        //               questionId: item.id,
        //               examPaperId: req_body.paper.id,
        //               score: item.score,
        //               doRight: item.doRight,
        //               doUser: req_body.user.username,
        //               // doTime: req_body.user.doTime,
        //           }
        //         );
        //     })();
        //
        // }
        return 1;
    }
}

module.exports = ExamPaper;
