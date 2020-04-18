var express = require("express");
let router = express.Router();
var Module = require("../entity/module");
let axios = require("axios");
let qs = require("qs");

/*
路径：/question/list  获取题库中题目
*/
router.get("/list", function (req, res) {
  (async () => {
    let T_Question = await Module.T_Question.findAll();
    let dataValues = [];

    for (let p of T_Question) {
      dataValues.push(p);
    }
    res.json(dataValues);
  })();
});

/*
路径：/question/sel-que  获取单个题目
*/
router.get("/sel-que", function (req, res) {
  req_query = req.query;
  console.log(req_query);

  (async () => {
    let T_Question = await Module.T_Question.findAll({
      where: {
        id: req_query.id,
      },
    });
    let dataValues = [];

    for (let p of T_Question) {
      dataValues.push(p);
    }
    res.json(dataValues);
  })();
});

/*
路径：/question/add-que  给题库添加题目
*/
router.post("/add-que", function (req, res) {
  let req_body = req.body;

  //创建题目时间 格式处理
  let time = new Date(req_body.create_time);
  req_body.create_time = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

  //   生成随机id
  // req_body.id = Math.random() * 1000;
  //   options格式处理
  req_body.options = JSON.stringify(req_body.options);

  console.log("数据处理后的req_body:", req_body);
  (async () => {
    let T_Question = await Module.T_Question.create(req_body); //新增题目

    console.log("新增题目: " + JSON.stringify(T_Question));
    res.json({
      state: 200,
      msg: "新增题目成功",
    });
  })();
});

/*
路径：/question/edit-que  编辑题目
*/
router.post("/edit-que", function (req, res) {
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
路径： question/del-que  删除题目
*/
router.post("/del-que", function (req, res) {
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
