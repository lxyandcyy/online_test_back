var express = require("express");
var app = express();
var bodyParser = require("body-parser");

let user = require("./routes/user");
let question = require("./routes/question");
let paper = require("./routes/paper");
let verifyToken = require("./routes/verifyToken");
let practicePaper = require("./routes/practicePaper");

let cors = require("cors");

// 解决cors跨域问题
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//解决body-parser限制body长度问题
app.use(
  bodyParser.json({
    limit: "10000kb",
  })
);
app.use(
  bodyParser.urlencoded({
    limit: "10000kb",
    parameterLimit: 10000000000000000,
    extended: true,
  })
);

// 所有接口设置
app.use("/user", user);
app.use("/question", question);
app.use("/paper", paper);
app.use("/verify-token", verifyToken);
app.use("/practice-paper", practicePaper);

let server = app.listen(6001, function () {
  console.log("服务器打开了--> http://localhost:6001/");
});

server.setTimeout(0);
