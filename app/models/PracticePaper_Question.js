const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class PracticePaper_Question extends Model {}

PracticePaper_Question.init(
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        questionId: Sequelize.INTEGER,
        practicePaperId: Sequelize.INTEGER,
    },
    {
        sequelize,
        tableName: "practice_paper__question",
    }
);

module.exports = PracticePaper_Question;
