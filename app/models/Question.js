const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * 题目实体，对应题目表
 */

class Question extends Model {}
Question.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        subjectId: DataTypes.INTEGER,
        difficult: DataTypes.INTEGER,
        correct: DataTypes.STRING(20),
        /** 创建的用户 */
        createUser: DataTypes.STRING(20),
        createTime: DataTypes.DATE,
        /** 题干 */
        topic: DataTypes.STRING(20),
        /** 解析 */
        analysis: DataTypes.STRING(20),
        /** 选项 */
        options: DataTypes.STRING(20),
    },
    {
        sequelize,
        tableName: "question",
    }
);

module.exports = Question;
