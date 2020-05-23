var express = require("express");
let router = express.Router();
var Service = require("../service/Service");
let Models = require("../models/Models");
let axios = require("axios");
let qs = require("qs");

/**
 * 获取数量（用户、试卷、题目）
 */
router.get("/countData", async function (req, res) {
    const { ExamPaper, User, Question, PracticePaper } = Models;
    const promisesCount = [ExamPaper, User, Question, PracticePaper].map(
        (item) => {
            return item.count();
        }
    );
    const [
        examPaperCount,
        userCount,
        questionCount,
        practicePaperCount,
    ] = await Promise.all(promisesCount);

    res.json({
        examPaperCount,
        userCount,
        questionCount,
        practicePaperCount,
    });
});

module.exports = router;
