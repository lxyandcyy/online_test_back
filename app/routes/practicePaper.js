var express = require("express");
let router = express.Router();
var Module = require("../models/module");

/*
路径：/practice-paper/list  获取试卷
*/
router.get("/list", function (req, res) {
    (async () => {
        let Practic_Paper = await Module.Practic_Paper.findAll();
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
        let single_paper = await Module.Practic_Paper.findAll({
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
            await Module.T_Question.findAll({
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
router.post("/add", function (req, res) {
    let req_body = req.body;

    //创建试卷时间 格式处理
    let time = new Date();
    req_body.createTime = `${time.getFullYear()}-${
        time.getMonth() + 1
    }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

    console.log("新增试卷的表单数据：", req_body);

    (async () => {
        // 新增试卷
        let Practic_Paper = await Module.Practic_Paper.create({
            practicePaperName: "智能试卷",
            subjectsId: JSON.stringify(req_body.subjectsId),
            questionCount: req_body.questionCount,
            difficult: req_body.difficult,
            createTime: req_body.createTime,
        });

        // 三个条件来随机选取题目，并添加到试卷
        const questionItems = await Module.T_Question.findAll({
            where: {
                difficult: req_body.difficult,
                subject_id: 1,
            },
        });

        req_body.practicePaperId = Practic_Paper.dataValues.practicePaperId;
        let real_que_count =
            req_body.questionCount <= questionItems.length
                ? req_body.questionCount
                : questionItems.length; //真正插入试卷的题目数量

        for (let i = 0; i < real_que_count; i++) {
            // 新增试卷与题目的关联关系;
            await Module.PracticePaper_Question.create({
                practicePaperId: req_body.practicePaperId, //试卷id
                questionId: questionItems[i].dataValues.id,
            });
        }

        res.json({
            state: 200,
            data: questionItems,
            msg: "新增试卷成功",
        });
    })();
});

/*
路径：/practice-paper/edit  编辑题目
*/
router.post("/edit", function (req, res) {
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
        let single_paper = await Module.Practic_Paper.update(
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
        ); //更新Practic_Paper表

        // 删除试卷对应的所有题目
        let paper_que_cus_ans = await Module.Practic_Paper_Question_Custom_Answer.destroy(
            {
                where: {
                    exam_paper_id: req_body.id,
                },
            }
        );

        // 添加试卷对应的题目
        for (let p = 0; p < req_body.questionItems.length; p++) {
            let paper_que_cus_ans = await Module.Practic_Paper_Question_Custom_Answer.create(
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
路径： practice-paper/del  删除智能练习试卷
*/
router.post("/del", function (req, res) {
    let Id = req.body.practicePaperId;
    console.log("删除试卷所提交的id：", Id);

    (async () => {
        let single_paper = await Module.Practic_Paper.destroy({
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
