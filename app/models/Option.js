const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

class Option extends Model {}
Option.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        /** questionId 外键 */
        // questionId: {
        //   type: DataTypes.BIGINT
        // },
        label: {
            type: DataTypes.STRING(1),
            unique: true,
        },
        description: {
            type: DataTypes.STRING(255),
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        tableName: "option",
    }
);

module.exports = Option;
