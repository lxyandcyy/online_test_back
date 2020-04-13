var express = require("express");
let router = express.Router();
var Module = require("../entity/module");
let axios = require("axios");
let qs = require("qs");

/*
路径：/paper/list  获取试卷
*/
router.get("/list", function (req, res) {
  (async () => {
    let T_Exam_Paper = await Module.T_Exam_Paper.findAll();
    let dataValues = [];

    for (let p of T_Exam_Paper) {
      dataValues.push(p);
    }
    res.json(dataValues);
  })();
});

/*
路径：/paper/sel-paper  获取单个试卷
*/
router.get("/sel-paper", function (req, res) {
  Id = req.query.id;
  let dataValues = {
    questionItems: [],
  };
  console.log("当前选择的单个试卷ID为：", Id);

  (async () => {
    let single_paper = await Module.T_Exam_Paper.findAll({
      where: {
        id: Id,
      },
    });

    let single_paper_question_custom_answer = await Module.T_Exam_Paper_Question_Custom_Answer.findAll(
      {
        where: {
          exam_paper_id: Id,
        },
      }
    );

    for (let q of single_paper_question_custom_answer) {
      dataValues.questionItems.push({
        que_id: q.id,
        que_score: q.question_score,
      });
    }

    dataValues.pap = single_paper[0];

    console.log(dataValues);

    res.json(dataValues);
  })();
});

/*
路径：/paper/add-paper  新增试卷
*/
router.post("/add-paper", function (req, res) {
  let req_body = req.body;
  console.log("新增试卷的表单数据：", req_body);

  //创建试卷时间 格式处理
  let time = new Date(req_body.create_time);
  req_body.create_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  //   生成随机id
  t_exam_paper_id = Math.random() * 1000;

  //   options格式处理
  req_body.options = JSON.stringify(req_body.options);

  (async () => {
    // 新增试卷
    let T_Exam_Paper = await Module.T_Exam_Paper.create({
      id: t_exam_paper_id,
      name: req_body.name,
      subject_id: req_body.subject_id,
      countdown: req_body.countdown,
      create_time: req_body.create_time,
    });

    await req_body.questionItems.forEach((q) => {
      let T_Exam_Paper_Question_Custom_Answer = Module.T_Exam_Paper_Question_Custom_Answer.create(
        {
          id: Math.random() * 1000,
          question_id: q.id,
          exam_paper_id: t_exam_paper_id,
          subject_id: q.subject_id,
        }
      ).catch((err) => console.log(err));
      console.log(
        "新增试卷，T_EXam_Paper_Question_Custom_Answer: " +
          JSON.stringify(T_Exam_Paper_Question_Custom_Answer)
      );
    });

    console.log("新增试卷，T_Exam_Paper: " + JSON.stringify(T_Exam_Paper));

    res.json({
      state: 200,
      msg: "新增试卷成功",
    });
  })();
});

/*
路径：/paper/edit-paper  编辑题目
*/
router.post("/edit-paper", function (req, res) {
  let req_body = req.body;
  console.log("编辑题目所提交的数据：", req_body);

  //编辑题目时间 格式处理
  let time = new Date(req_body.create_time);
  req_body.create_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  //   options格式处理
  req_body.options = JSON.stringify(req_body.options);

  (async () => {
    let single_que = await Module.T_Question.update(req_body, {
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
路径： paper/del-paper  删除题目
*/
router.post("/del-paper", function (req, res) {
  let Id = req.body.id;
  console.log("删除题目所提交的id：", Id);

  (async () => {
    let single_que = await Module.T_Question.destroy({
      where: {
        id: Id,
      },
    }); //删除题目
    console.log("删除题目: " + JSON.stringify(single_que));

    res.json({
      state: 200,
      msg: "题目删除成功",
    });
  })();
});

module.exports = router;
