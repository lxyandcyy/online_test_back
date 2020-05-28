var express = require("express");
let router = express.Router();
var Service = require("../service/Service");
var Module = require("../models/Models");

/**
 * 获取数量（用户、试卷、题目）
 */
router.get("/countData", async function (req, res) {
    const { ExamPaper, User, Question } = Module;
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

router.get("/pie/:examPaperId", async function (req, res) {
    console.log(req.params);
    let passGrade; //及格分
    let paperScore = 0; //试卷总分
    let [passCount, unPassCount] = [0, 0]; //[及格人数，不及格人数]

    /* 计算该试卷总分 */
    // 找出该试卷的所有试题
    const currentExamPaper = await Module.ExamPaper_Question.findAll({
        where: { examPaperId: req.params.examPaperId },
    });
    // 各题目分数相加
    for (item of currentExamPaper) {
        paperScore = paperScore + item.get("score");
    }

    /* 及格分=0.6*总分 */
    passGrade = 0.6 * paperScore;

    /* 计算 [及格人数，不及格人数] */
    const user_examPaper = await Module.User_ExamPaper.findAll({
        where: { examPaperId: req.params.examPaperId },
    });
    for (item of user_examPaper) {
        if (item.userScore >= passGrade) {
            passCount++;
        } else {
            unPassCount++;
        }
    }

    res.json({
        code: 200,
        msg: "试卷及格数量统计成功",
        data: { passGrade, passCount, unPassCount },
    });
});

router.get("/histogram/:examPaperId", async function (req, res) {
    let rank = [
        // {userId:'lxy',userScore:0}
    ]; //排名情况

    res.json({
        code: 200,
        msg: "用户排名统计成功",
        data: rank,
    });
});

router.get("/bar/:examPaperId", async function (req, res) {});

module.exports = router;
