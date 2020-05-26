var express = require("express");
let router = express.Router();
let axios = require("axios");
let qs = require("qs");
var Service = require("../service/Service");
let Token = require("../util/Token.js");

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
路径：/user/regInfo 用户基本信息提交
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
            msg: "用户基本信息提交成功",
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
            console.log(req.body);
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
    let reqBody = req.body;
    axios
        .post(
            "https://aip.baidubce.com/rest/2.0/face/v3/search",
            qs.stringify(reqBody)
        )
        .then((response) => {
            // 用jwt生成用户身份验证的token
            let log_token = Token.createToken({ user_id: reqBody.user_id });
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
router.get("/allUserInfo", async function (req, res) {
    let users = await Service.User.findUsers();
    res.json({
        code: 200,
        msg: "获取所有用户信息成功！",
        data: users,
    });
});

/*
路径：/user/sel-user  单个用户基本信息获取
*/
router.get("/sel-user", async function (req, res) {
    let user = await Service.User.findUser({ userId: req.query.user_id });
    res.json({
        code: 200,
        msg: "获取单个用户信息成功！",
        data: user,
    });
});

/*
路径：/user/update-user  更新单个用户信息
*/
router.post("/update-user", async function (req, res) {
    let affectCount = await Service.User.updateUser(
        { userId: req.body.user_id },
        req.body
    );
    let user = await Service.User.findUser({ userId: req.body.user_id });
    res.json({
        code: 200,
        msg: "更新用户信息成功",
        description: `更新了${affectCount}条记录`,
        data: user,
    });
});

/*
路径：/user/delete  删除单个用户
*/
router.post("/delete", async function (req, res) {
    let user = await Service.User.destroyUsers({ id: req.body.id });
    res.json({
        code: 200,
        msg: "删除单个用户成功！",
        data: user,
    });
});

module.exports = router;
