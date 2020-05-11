const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

// 智能试卷题目表
// TODO: 完成表设计
class PracticePaper_Question extends Model {}

PracticePaper_Question.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 外键引用 */
        // questionId: DataTypes.BIGINT,
        // practicePaperId: DataTypes.BIGINT
    },
    {
        sequelize,
        tableName: "practice_paper__question",
    }
);

module.exports = PracticePaper_Question;
