const User = require("./User");
const Question = require("./Question");
const Option = require("./Option");
const Subject = require("./Subject");
const ErrorBook = require("./ErrorBook");

const PracticePaper = require("./PracticePaper");
const PracticePaper_Question = require("./PracticePaper_Question");
const User_PracticePaper = require("./User_PracticePaper");
const User_PracticePaper_Question = require("./User_PracticePaper_Question");

const ExamPaper = require("./ExamPaper");
const ExamPaper_Question = require("./ExamPaper_Question");
const User_ExamPaper = require("./User_ExamPaper");
const User_ExamPaper_Question = require("./User_ExamPaper_Question");

/**
 * Question 和 User_ExamPaper 表
 * 生成 User_ExamPaper_Question
 * 用户的做题试卷信息
 */
Question.belongsToMany(User_ExamPaper, {
    through: User_ExamPaper_Question,
    foreignKey: "questionId",
    uniqueKey: false,
});
User_ExamPaper.belongsToMany(Question, {
    through: User_ExamPaper_Question,
    foreignKey: "user_ExamPaperId",
    uniqueKey: false,
});

/**
 * Question 和 User_PracticePaper 表
 * 生成 User_PracticePaper_Question
 * 用户的做题试卷信息
 */
Question.belongsToMany(User_PracticePaper, {
    through: User_PracticePaper_Question,
    foreignKey: "questionId",
    uniqueKey: false,
});
User_PracticePaper.belongsToMany(Question, {
    through: User_PracticePaper_Question,
    foreignKey: "user_PracticePaperId",
    uniqueKey: false,
});

/**
 * User_ExamPaper_Question 和 Option 表
 * 用户的做题试卷信息
 */
Option.hasMany(User_ExamPaper_Question);
User_ExamPaper_Question.belongsTo(Option);

/**
 * User_PracticePaper_Question 和 Option 表
 * 用户的做题试卷信息
 */
Option.hasMany(User_PracticePaper_Question);
User_PracticePaper_Question.belongsTo(Option);

/**
 * PracticePaper 和 Subject 关联
 */
PracticePaper.belongsTo(Subject);
Subject.hasMany(PracticePaper);

/**
 * ExamPaper 和 Subject 关联
 * ExamPaper 的 Subject
 */
ExamPaper.belongsTo(Subject);
Subject.hasMany(ExamPaper);

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
 * 哪个用户创建的ExamPaper
 */
ExamPaper.belongsTo(User, {
    foreignKey: "createUser",
});
User.hasMany(ExamPaper, {
    foreignKey: "createUser",
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
 * PracticePaper 和 User 关联
 * PracticePaper 里的 User
 * User 在哪些 PracticePaper 里
 */
PracticePaper.belongsToMany(User, {
    through: User_ExamPaper,
    foreignKey: "practicePaperId",
});
User.belongsToMany(PracticePaper, {
    through: User_PracticePaper,
    foreignKey: "userId",
});

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

/**
 * Question 和 User 关联
 * 生成错题表
 */
Question.belongsToMany(User, {
    through: ErrorBook,
    foreignKey: "questionId",
});
User.belongsToMany(Question, {
    through: ErrorBook,
    foreignKey: "userId",
});

module.exports = {
    User: User,
    Question: Question,
    Subject: Subject,
    Option: Option,
    ErrorBook: ErrorBook,

    PracticePaper: PracticePaper,
    PracticePaper_Question: PracticePaper_Question,
    User_PracticePaper: User_PracticePaper,
    User_PracticePaper_Question: User_PracticePaper_Question,

    ExamPaper: ExamPaper,
    User_ExamPaper: User_ExamPaper,
    ExamPaper_Question: ExamPaper_Question,
    User_ExamPaper_Question: User_ExamPaper_Question,
};
