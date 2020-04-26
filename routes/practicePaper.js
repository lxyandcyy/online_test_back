var express = require("express");
let router = express.Router();
var Module = require("../entity/module");

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
          id: q.question_id,
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
  req_body.create_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  console.log("新增试卷的表单数据：", req_body);

  (async () => {
    // 新增试卷
    let Practic_Paper = await Module.Practic_Paper.create({
      practice_paper_name: "智能试卷",
      subjects_id: JSON.stringify(req_body.subjects_id),
      question_count: req_body.question_count,
      difficult: req_body.difficult,
      create_time: req_body.create_time,
    });

    // 三个条件来随机选取题目，并添加到试卷
    const questionItems = await Module.T_Question.findAll({
      where: {
        difficult: req_body.difficult,
        subject_id: 1,
      },
    });

    req_body.practice_paper_id = Practic_Paper.dataValues.practice_paper_id;
    let real_que_count =
      req_body.question_count <= questionItems.length
        ? req_body.question_count
        : questionItems.length; //真正插入试卷的题目数量

    for (let i = 0; i < real_que_count; i++) {
      // 新增试卷与题目的关联关系;
      await Module.PracticePaper_Question.create({
        practice_paper_id: req_body.practice_paper_id, //试卷id
        question_id: questionItems[i].dataValues.id,
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
  let time = new Date(req_body.create_time);
  req_body.create_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  //   options格式处理
  req_body.questionItems.options = JSON.stringify(
    req_body.questionItems.options
  );

  (async () => {
    let single_paper = await Module.Practic_Paper.update(
      {
        subject_id: req_body.subject_id,
        name: req_body.name,
        countdown: req_body.countdown,
        create_time: req_body.create_time,
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
          exam_paper_id: req_body.id,
          question_id: req_body.questionItems[p].id,
          subject_id: req_body.questionItems[p].subject_id,
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
  let Id = req.body.practice_paper_id;
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
