const User = require("./User");
const Question = require("./Question");
const ExamPaper = require("./ExamPaper");
const PracticePaper = require("./PracticePaper");
const PracticePaper_Question = require("./PracticePaper_Question.js");
const User_ExamPaper_Question = require("./User_Question_ExamPaper");

module.exports = {
    UserInfo: User,
    T_Question: Question,
    T_Exam_Paper: ExamPaper,
    Practic_Paper: PracticePaper,
    PracticePaper_Question,
    T_Exam_Paper_Question_Custom_Answer: User_ExamPaper_Question,
};
