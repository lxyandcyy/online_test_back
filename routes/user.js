var express = require("express");
let router = express.Router();
var Module = require("../db/module");
let axios = require("axios");
let qs = require("qs");

/*
路径：/user/regInfo
*/
router.post("/regInfo", function(req, res) {
  const req_body = req.body;
  console.log(req_body);

  //   查询是否用户已注册
  const isReg = async function() {
    let UserInfo = await Module.UserInfo.findAll({
      where: {
        user_id: req_body.user_id
      }
    });
    return UserInfo;
  };

  // 向数据库添加新用户信息
  (async () => {
    let isreg = await isReg(); //判断用户是否重复注册
    if (isreg.length == 0) {
      //数据库没有此用户，能注册
      let UserInfo = await Module.UserInfo.create({
        user_id: req_body.user_id,
        password: req_body.password
      });
      console.log("注册新用户: " + JSON.stringify(UserInfo));
      res.json({
        state: 200,
        msg: "用户注册成功"
      });
    } else {
      //已有相同用户，不能注册
      res.json({
        state: 400,
        msg: "用户已被注册"
      });
    }
  })();
});

/*
路径：/user/regFace
*/
router.post("/regFace", function(req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/faceset/user/add",
      qs.stringify(req.body)
    )
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

/*
路径：/user/Login
*/
router.post("/Login", function(req, res) {
  axios
    .post(
      "https://aip.baidubce.com/rest/2.0/face/v3/search",
      qs.stringify(req.body)
    )
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.log(error);
    });
});

module.exports = router;
