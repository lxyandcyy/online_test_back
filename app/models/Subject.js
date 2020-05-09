const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class Subject extends Model {}
Subject.init(
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(20),
        },
    },
    {
        sequelize,
        tableName: "subject",
    }
);

module.exports = Subject;
