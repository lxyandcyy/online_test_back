const Sequelize = require("sequelize");
const config = require("./config");

// 创建一个sequelize对象实例
var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,

  {
    host: config.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 30000,
    },
  }
);

const UserInfo = sequelize.define(
  "user_info",
  {
    user_id: {
      type: Sequelize.STRING(20),
      primaryKey: true,
    },
    password: Sequelize.STRING(20),
    user_type: Sequelize.STRING(20),
    reg_time: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 定义模型 T_Question
// 对应表： t_question
const T_Question = sequelize.define(
  "t_question",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    subject_id: Sequelize.INTEGER,
    difficult: Sequelize.INTEGER,
    correct: Sequelize.STRING(20),
    create_user: Sequelize.STRING(20),
    create_time: Sequelize.STRING(20),
    topic: Sequelize.STRING(20),
    parse: Sequelize.STRING(20),
    options: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 定义模型 T_Exam_Paper
// 对应表： t_exam_paper
const T_Exam_Paper = sequelize.define(
  "t_exam_paper",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    name: Sequelize.STRING(20),
    subject_id: Sequelize.INTEGER,
    grade_level: Sequelize.INTEGER,
    paper_score: Sequelize.INTEGER,
    question_count: Sequelize.INTEGER,
    countdown: Sequelize.INTEGER,
    frame_text_content_id: Sequelize.INTEGER,
    create_user: Sequelize.STRING(20),
    create_time: Sequelize.STRING(20),
    deleted: Sequelize.INTEGER,
    task_exam_id: Sequelize.INTEGER,
    end_time: Sequelize.STRING(20),
    start_time: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 定义模型 Practic_Paper 智能训练试卷表
// 对应表： Practic_Paper
const Practic_Paper = sequelize.define(
  "practice_paper",
  {
    practice_paper_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    practice_paper_name: Sequelize.STRING(20),
    subjects_id: Sequelize.STRING(20),
    question_count: Sequelize.INTEGER,
    difficult: Sequelize.INTEGER,
    create_time: Sequelize.STRING(20),
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 定义模型 PracticePaper_Question  训练试卷与题目关系表
// 对应表： PracticePaper_Question
const PracticePaper_Question = sequelize.define(
  "practicePaper_question",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    question_id: Sequelize.INTEGER,
    practice_paper_id: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

// 定义模型 T_Exam_Paper_Question_Custom_Answer   试卷与题目关系表
// 对应表： t_exam_paper_question_custom_answer
const T_Exam_Paper_Question_Custom_Answer = sequelize.define(
  "t_exam_paper_question_custom_answer",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    question_id: Sequelize.INTEGER,
    exam_paper_id: Sequelize.INTEGER,
    exam_paper_answer_id: Sequelize.INTEGER,
    question_type: Sequelize.INTEGER,
    subject_id: Sequelize.INTEGER,
    customer_score: Sequelize.INTEGER,
    question_score: Sequelize.INTEGER,
    question_text_content_id: Sequelize.INTEGER,
    do_right: Sequelize.STRING(20),
    do_user: Sequelize.STRING(20),
    do_time: Sequelize.STRING(20),
    item_order: Sequelize.INTEGER,
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);

module.exports = {
  UserInfo,
  T_Question,
  T_Exam_Paper,
  Practic_Paper,
  PracticePaper_Question,
  T_Exam_Paper_Question_Custom_Answer,
};
