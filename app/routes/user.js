var express = require("express");
let router = express.Router();
var Module = require("../models/Models");
let axios = require("axios");
let qs = require("qs");
let jwt = require("jsonwebtoken");
var Service = require("../service/Service");
let TimeConverse = require("../util/timeConverse.js");

/*
路径：/user/getToken  
*/
router.post("/getToken", function (req, res) {
    axios
        .post(
            "https://aip.baidubce.com/oauth/2.0/token",
            qs.stringify(req.body)
        )
        .then((response) => {
            res.json(response.data);
        })
        .catch((err) => {
            console.log(err);
        });
});

/*
路径：/user/regInfo 用户基本信息注册
*/
router.post("/regInfo", async function (req, res) {
    const reqBody = req.body;
    //查找数据库是否有相同用户，没有则能注册，有则返回查询结果
    const [user, created] = await Service.User.findOrCreateUser(
        { userId: reqBody.user_id },
        reqBody
    );

    if (created) {
        res.json({
            code: 200,
            msg: "用户注册成功",
            data: user,
        });
    } else {
        res.json({
            code: 400,
            msg: "用户已存在",
            data: user,
        });
    }
});

/*
路径：/user/detectInfo  验证用户基本信息，如账号密码
*/
router.post("/detectInfo", async function (req, res) {
    const reqBody = req.body;
    //查询是否有该用户
    const user = await Service.User.findUser({
        userId: reqBody.user_id,
        userType: reqBody.user_type,
    });

    if (user === null) {
        res.json({
            code: 400,
            msg: "用户不存在！请先注册",
            data: null,
        });
    }
    //验证密码是否正确
    else if (user !== null && user.password === reqBody.password) {
        res.json({
            code: 200,
            msg: "账户验证成功！",
        });
    } else if (user !== null && user.password !== reqBody.password) {
        res.json({
            code: 401,
            msg: "密码错误！请重新输入",
        });
    }
});

/*
路径：/user/regFace 用户人脸绑定
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
路径：/user/Login 用户通过人脸base64照片登录
*/
router.post("/Login", function (req, res) {
    // 用jwt生成用户身份验证的token
    let log_token = jwt.sign(
        {
            username: req.body.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        "secret"
    );

    console.log("jwt生成的token:", log_token);

    axios
        .post(
            "https://aip.baidubce.com/rest/2.0/face/v3/search",
            qs.stringify(req.body)
        )
        .then((response) => {
            response.data["log_token"] = log_token;
            res.json(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
});

/*
路径：/user/changeFace  重新绑定人脸
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

/*
路径：/user/allUserInfo  所有用户基本信息获取
*/
router.get("/allUserInfo", function (req, res) {
    (async () => {
        let UserInfo = await Module.User.findAll();
        let dataValues = [];

        for (let p of UserInfo) {
            dataValues.push(JSON.parse(JSON.stringify(p)));
        }
        res.json(dataValues);
    })();
});

/*
路径：/user/sel-user  单个用户基本信息获取
*/
router.get("/sel-user", function (req, res) {
    (async () => {
        let UserInfo = await Module.User.findAll({
            where: {
                userId: req.query.username,
            },
        });
        let dataValues = [];

        dataValues.push(UserInfo[0]);
        res.json(dataValues[0]);
    })();
});

/*
路径：/user/update-user  单个用户基本信息获取
*/
router.post("/update-user", function (req, res) {
    (async () => {
        let UserInfo = await Module.User.update(req.body, {
            where: {
                username: req.body.username,
            },
        });
        console.log("更新用户信息: " + JSON.stringify(UserInfo));

        res.json({
            code: 200,
            msg: "更新用户信息成功",
        });
    })();
});

module.exports = router;
