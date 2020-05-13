var express = require("express");
let router = express.Router();
let axios = require("axios");
let qs = require("qs");
var Service = require("../service/Service");

/*
路径：/subject/destory/:id  删除单个学科
*/
router.post("/destory/:id", async function (req, res) {
    Service.Subject.destroySubjects({
        id: req.params.id,
    })
        .then(([destroyCount, subjects]) => {
            if (destroyCount !== 0) {
                res.json({
                    code: 200,
                    msg: "删除单个学科成功！",
                    destroyCount: `删除了${destroyCount}条记录`,
                    data: subjects,
                });
            } else {
                res.json({
                    code: 400,
                    msg: "该学科找不到！",
                    destroyCount: `删除了${destroyCount}条记录`,
                    data: subjects,
                });
            }
        })
        .catch((err) => res.json({ code: 500, msg: "未知错误", data: err }));
});

/*
路径：/subject/add  新增单个学科
*/
router.post("/add", async function (req, res) {
    Service.Subject.findOrCreateSubject(
        {
            name: req.body.name,
        },
        req.body
    )
        .then(([subject, created]) => {
            if (created) {
                res.json({
                    code: 200,
                    msg: "学科新增成功！",
                    data: subject,
                });
            } else {
                res.json({
                    code: 400,
                    msg: "已有该学科，添加失败！",
                    data: subject,
                });
            }
        })
        .catch((err) => {
            res.json({ code: 500, msg: "未知错误", data: err });
        });
});

/*
路径：/subject  查询所有学科
*/
router.get("/", async function (req, res) {
    Service.Subject.findSubjects()
        .then((subjects) => {
            res.json({
                code: 200,
                msg: "获取所有学科成功！",
                data: subjects,
            });
        })
        .catch((err) => {
            res.json({ code: 500, msg: "未知错误", data: err });
        });
});

/*
路径：/subject/:id  查询单个学科
*/
router.get("/:id", async function (req, res) {
    Service.Subject.findSubject({ id: req.params.id })
        .then((subject) => {
            if (subject !== null) {
                res.json({
                    code: 200,
                    msg: "查找单个学科成功！",
                    data: subject,
                });
            } else {
                res.json({
                    code: 400,
                    msg: "未找到该学科！",
                    data: subject,
                });
            }
        })
        .catch((err) => {
            res.json({ code: 500, msg: "未知错误", data: err });
        });
});

/*
路径：/subject/update/:id  更新单个学科信息
*/
router.post("/update/:id", async function (req, res) {
    Service.Subject.updateSubject(
        {
            id: req.params.id,
        },
        req.body
    )
        .then((subject) => {
            res.json({
                code: 200,
                msg: "更新学科成功！",
                data: subject,
            });
        })
        .catch((err) =>
            res.json({ code: 400, msg: "未找到该学科", data: null })
        );
});

module.exports = router;
