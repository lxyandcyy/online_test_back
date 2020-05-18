var Module = require("../models/Models");
let TimeConverse = require("../util/timeConverse.js");

class Question {
    constructor() {}

    // TODO：查找所有题目
    static async findQuestions(condition) {
        const questions = await Module.Question.findAll({
            where: condition,
        });
        return questions;
    }

    // TODO：查找单个题目
    static async findQuestion(condition) {
        const question = await Module.Question.findOne({
            where: condition,
        });
        return question;
    }

    // TODO：新增记录到question中
    static async createQuestion(reqBody) {
        const question = await Module.Question.create({
            ...reqBody,
            createTime: TimeConverse.timestampToDate(Date.now()),
        });

        return question;
    }

    //TODO: 删除question
    static async destoryQuestion(condition) {
        let question = await Question.findQuestion(condition);
        let destoryCount = await Module.Question.destroy({
            where: condition,
        });
        return [destoryCount, question];
    }
}

module.exports = Question;
