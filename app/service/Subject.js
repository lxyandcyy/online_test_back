var Module = require("../models/Models");

class Subject {
    constructor() {}

    // TODO：查找并创建学科
    static async findOrCreateSubject(condition, reqBody) {
        const [subject, created] = await Module.Subject.findOrCreate({
            where: condition,
            defaults: {
                id: reqBody.id,
                name: reqBody.name,
            },
        });
        return [subject, created];
    }

    // TODO：删除单个学科
    static async destroySubjects(condition) {
        const subjects = await Module.Subject.findAll({ where: condition });
        const destroyCount = await Module.Subject.destroy({ where: condition });
        return [destroyCount, subjects];
    }

    // TODO：查找所有学科
    static async findSubjects(condition) {
        const subjects = await Module.Subject.findAll({
            where: condition,
        });
        return subjects;
    }

    // TODO：查找单个学科
    static async findSubject(condition) {
        const subject = await Module.Subject.findOne({
            where: condition,
        });
        return subject;
    }

    // TODO：更新单个学科
    static async updateSubject(condition, reqBody) {
        const affectCount = await Module.Subject.update(reqBody, {
            where: condition,
        });
        return affectCount;
    }
}

module.exports = Subject;
