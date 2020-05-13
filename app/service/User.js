var Module = require("../models/Models");
let TimeConverse = require("../util/timeConverse.js");

class User {
    constructor() {}

    // TODO: 查询相同id
    // return {记录数量 count}
    static async sameCount(condition) {
        const count = await Module.User.count({
            where: condition,
        });
        return count;
    }

    // TODO：查找并创建用户
    static async findOrCreateUser(condition, reqBody) {
        const [user, created] = await Module.User.findOrCreate({
            where: condition,
            defaults: {
                userId: reqBody.user_id,
                password: reqBody.password,
                userType: reqBody.user_type,
                regTime: TimeConverse.timestampToDate(Date.now()),
            },
        });
        return [user, created];
    }

    // TODO: 查询相同id 的user
    // return {记录唯一 user}
    static async findUser(condition) {
        const user = await Module.User.findOne({
            where: condition,
        });
        return user;
    }

    // TODO: 查询所有的 users
    // return {所有符合条件的 user}
    static async findUsers(condition) {
        const users = await Module.User.findAll({
            where: condition,
        });
        return users;
    }

    // TODO: 更新 user
    // return {所有符合条件的 user}
    static async updateUser(condition, reqBody) {
        const affectCount = await Module.User.update(reqBody, {
            where: condition,
        });
        return affectCount;
    }
}

module.exports = User;
