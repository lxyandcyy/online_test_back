const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class User_PracticePaper_Question extends Model {}

User_PracticePaper_Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        /** 外键 */
        // questionId: DataTypes.BIGINT,
        // user_PracticePaperId: DataTypes.BIGINT,
        // optionId: DataTypes.BIGINT,
        /** 题目是否做正确 */
        correct: DataTypes.BOOLEAN,
    },
    {
        sequelize,
        tableName: "user_practicePaper_que",
    }
);

module.exports = User_PracticePaper_Question;
