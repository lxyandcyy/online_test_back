var express = require("express");
let router = express.Router();
var Service = require("../service/Service");

/*
路径：/records/:id  查询用户考试记录
*/
router.get("/:id", async function (req, res) {
    console.log(req.params.id);
    Service.User_ExamPaper.findRecords(req.params.id)
        .then((records) => {
            res.json({
                code: 200,
                msg: "获取所有考试记录成功！",
                data: records,
            });
        })
        .catch((err) => {
            res.json({ code: 500, msg: "未知错误", data: err });
        });
});

/*
路径：/records?userId&examPaperId  查询答题卡
*/
router.get("/", async function (req, res) {
    let records = await Service.User_ExamPaper.findRecord({
        examPaperId: parseInt(req.query.examPaperId),
        userId: parseInt(req.query.userId),
    });
    res.json({
        code: 200,
        msg: "答题卡获取成功",
        data: records,
    });
});

module.exports = router;
