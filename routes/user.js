var express = require("express");
let router = express.Router();
var Module = require("../entity/module");
let axios = require("axios");
let qs = require("qs");

/*
路径：/user/getToken
*/
router.post("/getToken", function (req, res) {
  axios
    .post("https://aip.baidubce.com/oauth/2.0/token", qs.stringify(req.body))
    .then((response) => {
      res.json(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

/*
路径：/user/regInfo
*/
router.post("/regInfo", function (req, res) {
  const req_body = req.body;
  console.log(req_body);

  //   查询是否用户已注册
  const isReg = async function () {
    let UserInfo = await Module.UserInfo.findAll({
      where: {
        user_id: req_body.user_id,
      },
    });
    return UserInfo;
  };

  // 向数据库添加新用户信息
  (async () => {
    let isreg = await isReg(); //判断用户是否重复注册
    if (isreg.length == 0) {
      //数据库没有此用户，能注册
      console.log("数据库中于此用户名相同的有：", isreg);
      //注册时间格式处理
      let time = new Date(req_body.reg_time);
      time = `${time.getFullYear()}-${
        time.getMonth() + 1
      }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;

      let UserInfo = await Module.UserInfo.create({
        user_id: req_body.user_id,
        password: req_body.password,
        user_type: req_body.user_type,
        reg_address: req_body.reg_address,
        reg_time: time,
      });
      console.log("注册新用户: " + JSON.stringify(UserInfo));
      res.json({
        state: 200,
        msg: "用户注册成功",
      });
    } else {
      //已有相同用户，不能注册
      res.json({
        state: 400,
        msg: "用户已被注册",
      });
    }
  })();
});

/*
路径：/user/detectInfo
*/
router.post("/detectInfo", function (req, res) {
  const req_body = req.body;

  //查询是否有该用户
  const hasUser = async function () {
    let UserInfo = await Module.UserInfo.findAll({
      where: {
        user_id: req_body.user_id,
      },
    });
    return UserInfo;
  };

  //验证账户、密码
  (async () => {
    let hasuser = await hasUser(); //判断用户是否存在
    const user = hasuser[0];
    //数据库有此用户，且密码正确
    if (hasuser.length !== 0 && user.password === req_body.password) {
      res.json({
        state: 200,
        msg: "账户验证成功！",
      });
    } else if (hasuser.length === 0) {
      res.json({
        state: 400,
        msg: "没有此用户！",
      });
    } else if (hasuser.length !== 0 && hasuser.password !== req_body.password) {
      res.json({
        state: 401,
        msg: "密码错误！",
      });
    }
  })();
});

/*
路径：/user/regFace
*/
router.post("/regFace", function (req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add",
      qs.stringify(req.body)
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

/*
路径：/user/Login
*/
router.post("/Login", function (req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/search",
      qs.stringify(req.body)
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

/*
路径：/user/changeFace
*/
router.post("/changeFace", function (req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/update",
      qs.stringify(req.body)
    )
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

module.exports = router;
