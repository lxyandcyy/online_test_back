var Module = require("../models/Models");
let Service = require("../service/Service");
let TimeConverse = require("../util/timeConverse.js");
const Op = require("sequelize").Op;

class PracticePaper {
    constructor() {}

    // TODO：查找所有试卷
    // static async findPapers(condition) {
    //     const examPapers = await Module.ExamPaper.findAll({
    //         where: condition,
    //     });
    //     return examPapers;
    // }

    // TODO: 查找单个试卷详细内容
    // static async findPaper(condition) {
    //     const examPaper = await Module.ExamPaper.findOne({
    //         where: condition,
    //     });
    //
    //     let examPaper_question = await Module.ExamPaper_Question.findAll({
    //         where: { examPaperId: examPaper.id },
    //     });
    //     return [examPaper, examPaper_question];
    // }

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

    // TODO: 删除试卷
    static async destoryPaper(condition) {
        const examPaper = await Module.ExamPaper.findOne({ where: condition });
        const destroyCount = await Module.ExamPaper.destroy({
            where: condition,
        });
        return [destroyCount, examPaper];
    }

    //TODO：保存答题卡数据
    // static async saveAnswerSheet(reqBody) {
    //     let user_examPaper = await Module.User_ExamPaper.create({
    //         ...reqBody,
    //         doTime: TimeConverse.timestampToDate(Date.now()),
    //     });
    //
    //     const records = reqBody.questions.map((question) => {
    //         const res = {};
    //         res.user_ExamPaperId = user_examPaper.id;
    //         res.questionId = question.id;
    //         res.OptionId = question.OptionId;
    //         return res;
    //     });
    //     let user_examPaper_question = await Module.User_ExamPaper_Question.bulkCreate(
    //         records
    //     );
    //
    //     return [user_examPaper, user_examPaper_question];
    // }
}

module.exports = PracticePaper;
