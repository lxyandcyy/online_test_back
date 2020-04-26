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
    let single_paper = await Module.T_Exam_Paper.update(
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
    ); //更新t_exam_paper表

    // 删除试卷对应的所有题目
    let paper_que_cus_ans = await Module.T_Exam_Paper_Question_Custom_Answer.destroy(
      {
        where: {
          exam_paper_id: req_body.id,
        },
      }
    );

    // 添加试卷对应的题目
    for (let p = 0; p < req_body.questionItems.length; p++) {
      let paper_que_cus_ans = await Module.T_Exam_Paper_Question_Custom_Answer.create(
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
路径： paper/del-paper  删除题目
*/
router.post("/del-paper", function (req, res) {
  let Id = req.body.id;
  console.log("删除试卷所提交的id：", Id);

  (async () => {
    let single_paper = await Module.T_Exam_Paper.destroy({
      where: {
        id: Id,
      },
    }); //删除题目

    let paper_que_cus_ans = await Module.T_Exam_Paper_Question_Custom_Answer.destroy(
      {
        where: {
          exam_paper_id: Id,
        },
      }
    ); //
    console.log("删除题目: " + JSON.stringify(single_paper));
    console.log("删除题目: " + JSON.stringify(paper_que_cus_ans));

    res.json({
      state: 200,
      msg: "题目删除成功",
    });
  })();
});

/*
路径：/paper/submit-exam  提交答题内容
*/
router.post("/submit-exam", function (req, res) {
  let req_body = req.body;
  console.log("做题内容数据：", req_body);

  //做题时间 格式处理
  let time = new Date();
  req_body.user.do_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  // {
  //   formQueItems: [
  //     {
  //       id: 2,
  //       subject_id: 1,
  //       difficult: 5,
  //       correct: 'C',
  //       create_user: '',
  //       create_time: '2020-4-17 11:43:1',
  //       topic: '阿桑的歌',
  //       parse: '52345',
  //       options: [Array],
  //       current_option: 3
  //     },
  //     {
  //       id: 3,
  //       subject_id: 1,
  //       difficult: 3,
  //       correct: 'B',
  //       create_user: 'lxyoryxl',
  //       create_time: '2020-4-23 14:7:3',
  //       topic: 'asdgag',
  //       parse: 'fdghdfgh',
  //       options: [Array],
  //       current_option: 1
  //     }
  //   ],
  //   paper: {
  //     id: 774,
  //     name: '见刚好是的',
  //     subject_id: 1,
  //     grade_level: null,
  //     paper_score: null,
  //     question_count: null,
  //     countdown: 8,
  //     frame_text_content_id: null,
  //     create_user: null,
  //     create_time: '2020-4-23 14:7:28',
  //     deleted: null,
  //     task_exam_id: null,
  //     end_time: null,
  //     start_time: null
  //   }
  // }

  // 计算得分
  req_body.formQueItems.forEach((item) => {
    let map = []; //一道题的选项映射
    for (let i = 0; i < item.options.length; i++) {
      map.push({ i: item.options[i].prefix });
    }
    // 比对答案
    if (item.corrent === map[item.current_option]) {
      item.do_right = true; //用户本题正确
      item.customer_score = 10; //item.question_score;//用户本题得分。。。。待修改
    } else {
      item.do_right = false; //用户本题错误
      item.customer_score = 0;
    }

    (async () => {
      // 新增考试记录
      let T_Exam_Paper_Question_Custom_Answer = await Module.T_Exam_Paper_Question_Custom_Answer.create(
        {
          question_id: item.id,
          exam_paper_id: req_body.paper.id,
          customer_score: item.customer_score,
          do_right: item.do_right,
          do_user: req_body.user.user_id,
          do_time: req_body.user.do_time,
        }
      );
    })();

    res.json({
      state: 200,
      msg: "计算分数成功",
    });
  });
});

module.exports = router;
