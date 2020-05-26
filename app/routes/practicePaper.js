var express = require("express");
let router = express.Router();
var Module = require("../models/Models");

/*
路径：/practice-paper/list  获取试卷
*/
router.get("/list", function (req, res) {
    (async () => {
        let Practic_Paper = await Module.PracticePaper.findAll();
        let dataValues = [];

        for (let p of Practic_Paper) {
            dataValues.push(p);
        }
        res.json(dataValues);
    })();
});

/*
路径：/practice-paper/sel  获取单个试卷
*/
router.get("/sel", function (req, res) {
    Id = req.query.id;
    let dataValues = {
        questionItems: [],
    };
    console.log("当前选择的单个试卷ID为：", Id);

    (async () => {
        let single_paper = await Module.PracticePaper.findAll({
            where: {
                id: Id,
            },
        });

        let single_paper_question_custom_answer = await Module.Practic_Paper_Question_Custom_Answer.findAll(
            {
                where: {
                    exam_paper_id: Id,
                },
            }
        );

        for (let q of single_paper_question_custom_answer) {
            await Module.Question.findAll({
                where: {
                    id: q.questionId,
                },
            }).then((res) => {
                console.log("我是在t_question表中找到的题目：", res);
                dataValues.questionItems.push(res[0]);
            });
        }

        dataValues.pap = single_paper[0];

        res.json(dataValues);
    })();
});

/*
路径：/practice-paper/add  生成智能练习试卷
*/
router.post("/add", async function (req, res) {
    console.log("传入", req.body);

    // 新增试卷
    let Practic_Paper = await Module.PracticePaper.create({
        name: "智能试卷",
        subjectsId: JSON.stringify(req_body.subjectsId),
        questionCount: req_body.questionCount,
        difficult: req_body.difficult,
        createTime: req_body.createTime,
    });

    // 三个条件来随机选取题目，并添加到试卷
    const questionItems = await Module.Question.findAll({
        where: {
            difficult: req_body.difficult,
            subjectId: 1,
        },
    });

    req_body.id = Practic_Paper.dataValues.id;
    let real_que_count =
        req_body.questionCount <= questionItems.length
            ? req_body.questionCount
            : questionItems.length; //真正插入试卷的题目数量

    for (let i = 0; i < real_que_count; i++) {
        // 新增试卷与题目的关联关系;
        await Module.PracticePaper_Question.create({
            id: req_body.id, //试卷id
            questionId: questionItems[i].dataValues.id,
        });
    }

    res.json({
        state: 200,
        data: questionItems,
        msg: "新增试卷成功",
    });
});

/*
路径： practice-paper/del  删除智能练习试卷
*/
router.post("/del", function (req, res) {
    let Id = req.body.id;
    console.log("删除试卷所提交的id：", Id);

    (async () => {
        let single_paper = await Module.PracticePaper.destroy({
            where: {
                practice_paper_id: Id,
            },
        }); //删除题目

        res.json({
            state: 200,
            msg: "智能练习试卷删除成功",
        });
    })();
});

module.exports = router;
