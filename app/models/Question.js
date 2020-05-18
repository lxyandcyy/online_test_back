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
        /** 外键 */
        // subjectId: {
        //   type: DataTypes.BIGINT
        // },
        /** 创建的用户外键 */
        // createUser: DataTypes.BIGINT,
        difficult: DataTypes.ENUM("1", "2", "3", "4", "5"),
        createTime: DataTypes.DATE,
        /** 题干 */
        topic: DataTypes.STRING(20),
        /** 解析 */
        analysis: DataTypes.STRING(20),
    },
    {
        hooks: { beforeDestroy(instance, options) {} },
        sequelize,
        tableName: "question",
    }
);

module.exports = Question;
