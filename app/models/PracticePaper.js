const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class PracticePaper extends Model {}

PracticePaper.init(
    {
        practicePaperId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        practicePaperName: DataTypes.STRING(20),
        subjectsId: DataTypes.STRING(20),
        questionCount: DataTypes.INTEGER,
        difficult: DataTypes.INTEGER,
        createTime: DataTypes.STRING(20),
    },
    {
        sequelize,
        tableName: "practice_paper",
    }
);

module.exports = PracticePaper;
