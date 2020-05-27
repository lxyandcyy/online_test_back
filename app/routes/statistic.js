var express = require("express");
let router = express.Router();
var Service = require("../service/Service");
let Models = require("../models/Models");

/**
 * 获取数量（用户、试卷、题目）
 */
router.get("/countData", async function (req, res) {
    const { ExamPaper, User, Question } = Models;
    const promisesCount = [ExamPaper, User, Question].map((item) => {
        return item.count();
    });
    const [examPaperCount, userCount, questionCount] = await Promise.all(
        promisesCount
    );

    res.json({
        examPaperCount,
        userCount,
        questionCount,
    });
});

module.exports = router;
