var Module = require("../models/Models");
const Op = require("sequelize").Op;

class Option {
    constructor() {}

    // TODO：查找一些题目的Options
    static async findOptions(allQuestion) {
        const questions = await Module.Question.findAll({
            where: {
                id: {
                    [Op.in]: allQuestion,
                },
            },
            include: Module.Option,
        });
        return questions;
    }
}

module.exports = Option;
