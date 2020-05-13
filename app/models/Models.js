const User = require("./User");
const Question = require("./Question");
const Option = require("./Option");
const Subject = require("./Subject");
const ExamPaper = require("./ExamPaper");
const PracticePaper = require("./PracticePaper");
const PracticePaper_Question = require("./PracticePaper_Question.js");
const User_ExamPaper_Question = require("./User_ExamPaper_Question");
const ExamPaper_Question = require("./ExamPaper_Question");
const User_ExamPaper = require("./User_ExamPaper");

/**
 * Question 和 User_ExamPaper 表
 * 用户的做题试卷信息
 */
Question.belongsToMany(User_ExamPaper, {
    through: User_ExamPaper_Question,
    foreignKey: "questionId",
});
User_ExamPaper.belongsToMany(Question, {
    through: User_ExamPaper_Question,
    foreignKey: "user_ExamPaperId",
});

/**
 * User_ExamPaper_Question 和 Option 表
 * 用户的做题试卷信息
 */
Option.hasMany(User_ExamPaper_Question);
User_ExamPaper_Question.belongsTo(Option);

/**
 * PracticePaper 和 Subject 关联
 */
PracticePaper.belongsTo(Subject);
Subject.hasMany(PracticePaper);

/**
 * PracticePaper 和 Question 关联
 * PracticePaper里面有哪些 Question
 * Question 被哪些 PracticePaper使用
 */
PracticePaper.belongsToMany(Question, {
    through: PracticePaper_Question,
    foreignKey: "practicePaperId",
});
Question.belongsToMany(PracticePaper, {
    through: PracticePaper_Question,
    foreignKey: "questionId",
});

/**
 * ExamPaper 和 User 关联
 * 哪个用户创建的ExamPaper
 */
ExamPaper.belongsTo(User, {
    foreignKey: "createUser",
});
User.hasMany(ExamPaper, {
    foreignKey: "createUser",
});

/**
 * ExamPaper 和 Question 关联
 * ExamPaper 里的 Question
 * Question 在哪些 ExamPaper里
 */
ExamPaper.belongsToMany(Question, {
    through: ExamPaper_Question,
    foreignKey: "examPaperId",
});
Question.belongsToMany(ExamPaper, {
    through: ExamPaper_Question,
    foreignKey: "questionId",
});

/**
 * ExamPaper 和 User 关联
 * ExamPaper 里的 User
 * User 在哪些 ExamPaper里
 */
ExamPaper.belongsToMany(User, {
    through: User_ExamPaper,
    foreignKey: "examPaperId",
});
User.belongsToMany(ExamPaper, {
    through: User_ExamPaper,
    foreignKey: "userId",
});

/**
 * ExamPaper 和 Subject 关联
 * ExamPaper 的 Subject
 */
ExamPaper.belongsTo(Subject);
Subject.hasMany(ExamPaper);

/**
 * Question 和 User 表关联
 * 哪个用户创建的 Question 记录
 */
Question.belongsTo(User, {
    foreignKey: {
        name: "createUser",
        allowNull: true,
    },
});
User.hasMany(Question, {
    foreignKey: {
        name: "createUser",
        allowNull: true,
    },
});

/**
 * Question 和 Subject 关联
 * Question 的 Subject
 */
Question.belongsTo(Subject);
Subject.hasMany(Question);

/**
 * Question 和 Option 关联
 * Question 的 Option 数组
 */
Option.belongsTo(Question);
Question.hasMany(Option);

module.exports = {
    User: User,
    Question: Question,
    ExamPaper: ExamPaper,
    PracticePaper: PracticePaper,
    Subject: Subject,
    Option: Option,
    PracticePaper_Question: PracticePaper_Question,
    User_ExamPaper: User_ExamPaper,
    ExamPaper_Question: ExamPaper_Question,
    User_ExamPaper_Question: User_ExamPaper_Question,
};
