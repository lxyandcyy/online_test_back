const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

// TODO: 完成表设计
class PracticePaper extends Model {}

PracticePaper.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: { type: DataTypes.STRING(20), defaultValue: "智能试卷" },
        /** 外键 */
        // subjectsId: DataTypes.STRING(20),
        questionCount: DataTypes.INTEGER,
        difficult: DataTypes.INTEGER,
        createTime: { defaultValue: DataTypes.NOW, type: DataTypes.DATE },
    },
    {
        sequelize,
        tableName: "practice_paper",
        getterMethods: {
            paperName() {
                return this.name + this.id;
            },
        },
    }
);

module.exports = PracticePaper;
