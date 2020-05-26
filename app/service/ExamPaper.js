var Module = require("../models/Models");
let Service = require("../service/Service");
let TimeConverse = require("../util/timeConverse.js");
const Op = require("sequelize").Op;
const { updateByPk } = require("../util/CRUDUtil");

class ExamPaper {
    constructor() {}

    // TODO：查找所有试卷
    static async findPapers(condition) {
        const examPapers = await Module.ExamPaper.findAll({
            where: condition,
            include: [
                {
                    model: Module.Subject,
                },
                {
                    model: Module.User,
                },
            ],
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
            include: [Module.Question],
        });
        return [examPaper, examPaper_question];
    }

    // TODO：新增试卷
    static async addPaper(reqBody) {
        let examPaper = await Module.ExamPaper.create({
            ...reqBody,
            isPublish: false,
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
            },
            {
                where: condition,
            }
        );
        return count;
    }

    /**
     * 更新试卷
     * @param primaryKey 主键
     * @param reqBody 数据
     * @returns {Promise<*>}
     */
    static async updatePaper(primaryKey, reqBody) {
        return updateByPk(primaryKey, reqBody, Module.ExamPaper);
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
