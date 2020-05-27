var express = require("express");
let router = express.Router();
var Module = require("../models/Models");
var Service = require("../service/Service");
const { updateByPkInRoute } = require("../util/CRUDUtil");

/*
路径：/exam-paper 获取所有试卷
*/
router.get("/", async function (req, res) {
    let examPapers = await Service.ExamPaper.findPapers({});
    res.json({
        code: 200,
        msg: "获取所有试卷成功！",
        data: examPapers,
    });
});

/*
路径：/exam-paper/:id  获取单个试卷
*/
router.get("/:id", async function (req, res) {
    let [examPaper, examPaper_question] = await Service.ExamPaper.findPaper({
        id: req.params.id,
    });

    res.json({
        code: 200,
        msg: "获取单个试卷成功！",
        data: { examPaper: examPaper, examPaper_question: examPaper_question },
    });
});

/*
路径：/exam-paper/add 新增试卷
*/
router.post("/add", async function (req, res) {
    let [examPaper, record] = await Service.ExamPaper.addPaper(req.body);
    res.json({
        code: 200,
        msg: "新增试卷成功",
        data: { examPaper: examPaper, record: record },
    });
});

/*
路径： exam-paper/delete/:id 删除试卷
*/
router.post("/delete/:id", async function (req, res) {
    let [destroyCount, examPaper] = await Service.ExamPaper.destoryPaper({
        id: req.params.id,
    });
    res.json({
        state: 200,
        msg: `删除${destroyCount}张试卷成功`,
        data: examPaper,
    });
});

/*
路径：/exam-paper/submit 提交答题卡
*/
router.post("/submit", async function (req, res) {
    try {
        const data = await Service.User_ExamPaper.submitExamPaper(req.body);
        return res.json({
            code: 200,
            msg: "成功提交试卷",
            data,
        });
    } catch (err) {
        console.log(err);
        return res.json({
            code: 400,
            msg: err.message,
            err: "发生了错误",
        });
    }
});

/*
路径：/exam-paper/update/:id 更新试卷
*/
router.post("/update/:id", async function (req, res) {
    await updateByPkInRoute(
        req,
        res,
        req.params.id,
        req.body,
        Module.ExamPaper
    );
});

/*
路径：/exam-paper/publish/:id 发布试卷
*/
router.post("/publish/:id", async function (req, res) {
    await Service.ExamPaper.publishPaper(
        {
            id: req.params.id,
        },
        req.body
    )
        .then(() => {
            res.json({
                code: 200,
                msg: `${
                    req.body.isPublish === true ? "发布试卷成功" : "试卷已无效"
                }`,
                data: null,
            });
        })
        .catch((err) =>
            res.json({ code: 400, msg: "未找到该试卷", data: null })
        );
});

module.exports = router;
