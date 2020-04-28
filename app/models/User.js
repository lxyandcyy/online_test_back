const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/DBconfig");

/**
 * 用户实体，对应用户表
 */

class User extends Model {}
User.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.STRING(20),
            unique: true,
        },
        password: DataTypes.STRING(255),
        user_type: DataTypes.STRING(20),
        reg_time: DataTypes.STRING(20),
    },
    {
        sequelize,
        tableName: "user_info",
    }
);

User.findOne({
    user_id: "hahaddhhaha",
}).then((user) => {
    userInstance = user.get({ plain: true });
    console.log(userInstance.user_id);
});

module.exports = User;
