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
    console.log(req.params.id);
    Service.Question.findQuestion({ id: req.params.id })
        .then((question) => {
            if (question) {
                res.json({
                    code: 200,
                    msg: "获取单个题目成功！",
                    data: question,
                });
            } else {
                res.json({
                    code: 400,
                    msg: "没有找到此题目！",
                    data: question,
                });
            }
        })
        .catch((err) => {
            res.json({ code: 500, msg: "获取所有题目失败！", data: err });
        });
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
        data: {
            question: question,
            options: myOptions.map((item) => {
                return item.get({ plain: true });
            }),
        },
    });
});

/*
路径：/question/edit-que  编辑题目
*/
router.post("/edit-que", function (req, res) {
    let req_body = req.body;
    console.log("编辑题目所提交的数据：", req_body);

    //编辑题目时间 格式处理
    let time = new Date(req_body.createTime);
    req_body.createTime = `${time.getFullYear()}-${
        time.getMonth() + 1
    }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    //   options格式处理
    req_body.options = JSON.stringify(req_body.options);

    (async () => {
        let single_que = await Module.Question.update(req_body, {
            where: {
                id: req_body.id,
            },
        }); //更新题目数据
        console.log("编辑题目: " + JSON.stringify(single_que));

        res.json({
            state: 200,
            msg: "编辑题目成功",
        });
    })();
});

/*
路径： question/delete/:id  删除题目
*/
router.post("/delete/:id", async function (req, res) {
    let [destoryCount, question] = await Service.Question.destoryQuestion({
        id: req.params.id,
    });

    res.json({
        state: 200,
        msg: `删除${destoryCount}条记录`,
        data: question,
    });
});

module.exports = router;
