var express = require("express");
let router = express.Router();
var Service = require("../service/Service");
let Models = require("../models/Models");
let axios = require("axios");
let qs = require("qs");

/*
路径：/question  获取题库中题目
*/
router.get("/", async function (req, res) {
    Service.Question.findQuestions()
        .then((questions) => {
            res.json({ code: 200, msg: "获取所有题目成功！", data: questions });
        })
        .catch((err) => {
            res.json({ code: 500, msg: "获取所有题目失败！", data: err });
        });
});

/*
路径：/question/:id 获取单个题目
*/
router.get("/:id", async function (req, res) {
    let question = await Service.Question.findQuestion({ id: req.params.id });
    if (question) {
        let options = await question.getOptions();
        res.json({
            code: 200,
            msg: "获取单个题目成功！",
            data: { question: question, options: options },
        });
    } else {
        res.json({
            code: 400,
            msg: "没有找到此题目！",
            data: question,
        });
    }
});

/*
路径：/question/options 获取一些题目的optioins
*/
router.post("/options", async function (req, res) {
    let questions = await Service.Option.findOptions(req.body["allQuestion"]);
    if (questions) {
        res.json({
            code: 200,
            msg: "获取一些题目的选项成功！",
            data: questions,
        });
    } else {
        res.json({
            code: 400,
            msg: "没有找到题目！",
            data: questions,
        });
    }
});

/*
路径：/question/add  添加题目
*/
router.post("/add", async function (req, res) {
    let question = await Service.Question.createQuestion(req.body);
    let myOptions = req.body.options;
    myOptions = await Promise.all(
        myOptions.map((item) => {
            return Models.Option.create(item);
        })
    );
    question.addOptions(myOptions);
    res.json({
        code: 200,
        msg: "题目新增成功！",
        data: {
            question: question,
            options: myOptions.map((item) => {
                return item.get({ plain: true });
            }),
        },
    });
});

/*
路径：/question/update/:id  更新题目
*/
router.post("/update/:id", function (req, res) {
    Service.Question.updateQuestion(
        {
            id: req.params.id,
        },
        req.body
    )
        .then((question) => {
            res.json({
                code: 200,
                msg: "更新题目成功！",
                data: question,
            });
        })
        .catch((err) =>
            res.json({ code: 400, msg: "未找到该题目", data: null })
        );
});

/*
路径： question/delete/:id  删除题目
*/
router.post("/delete/:id", async function (req, res) {
    let [destoryCount, question] = await Service.Question.destoryQuestion({
        id: req.params.id,
    });
    question.removeOptions();
    res.json({
        state: 200,
        msg: `删除${destoryCount}条记录`,
        data: question,
    });
});

module.exports = router;
