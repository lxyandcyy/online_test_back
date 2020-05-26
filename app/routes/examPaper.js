var express = require("express");
let router = express.Router();
var Module = require("../models/Models");
var Service = require("../service/Service");
let axios = require("axios");
let qs = require("qs");
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
路径：/exam-paper/edit/:id  编辑试卷
*/
router.post("/edit/:id", function (req, res) {
    let req_body = req.body;
    console.log("编辑题目所提交的数据：", req_body);

    //编辑试卷时间 格式处理
    let time = new Date(req_body.createTime);
    req_body.createTime = `${time.getFullYear()}-${
        time.getMonth() + 1
    }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    //   options格式处理
    req_body.questionItems.options = JSON.stringify(
        req_body.questionItems.options
    );

    (async () => {
        let single_paper = await Module.ExamPaper.update(
            {
                subjectId: req_body.subjectId,
                name: req_body.name,
                countDown: req_body.countDown,
                createTime: req_body.createTime,
            },
            {
                where: {
                    id: req_body.id,
                },
            }
        ); //更新t_exam_paper表

        // 删除试卷对应的所有题目
        let paper_que_cus_ans = await Module.User_ExamPaper_Question.destroy({
            where: {
                exam_paper_id: req_body.id,
            },
        });

        // 添加试卷对应的题目
        for (let p = 0; p < req_body.questionItems.length; p++) {
            let paper_que_cus_ans = await Module.User_ExamPaper_Question.create(
                {
                    examPaperId: req_body.id,
                    questionId: req_body.questionItems[p].id,
                    subjectId: req_body.questionItems[p].subjectId,
                }
            );
            console.log("添加试卷: " + JSON.stringify(paper_que_cus_ans));
        }

        res.json({
            state: 200,
            msg: "编辑试卷成功",
        });
    })();
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
            msg: "发生了错误",
            err: err.message,
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
