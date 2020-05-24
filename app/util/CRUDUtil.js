const Model = require("../models/Models");

exports.updateByPk = function (primaryKey, data, Model) {
    const primaryKeyAttribute = Model.primaryKeyAttribute;
    return Model.update(data, {
        where: {
            [primaryKeyAttribute]: primaryKey,
        },
    });
};

exports.updateByPkInRoute = async function (req, res, primaryKey, data, Model) {
    try {
        await exports.updateByPk(primaryKey, data, Model);
        res.json({
            code: 200,
            msg: `更新成功`,
            data: null,
        });
    } catch (err) {
        res.json({
            code: 400,
            msg: "未找到该试卷",
            data: null,
            err: err.message,
        });
    }
};
