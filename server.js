const ServerConfig = require("./app/config/ServerConfig.js");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

let user = require("./app/routes/user");
let question = require("./app/routes/question");
let examPaper = require("./app/routes/examPaper");
let subject = require("./app/routes/subject");
let verifyToken = require("./app/routes/verifyToken");
let statistic = require("./app/routes/statistic");
let records = require("./app/routes/records");


var fs = require('fs');
var http = require('http');
var https = require('https');

let cors = require("cors");

// 解决cors跨域问题
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ extended: false }));

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
app.use("/exam-paper", examPaper);
app.use("/subject", subject);
app.use("/verify-token", verifyToken);
app.use("/statistic", statistic);
app.use("/records", records);


app.get("/hello", (req, res, next) => {
    console.log(req.body);
    console.log(req.query);
    next(JSON.stringify(req.body));
});

app.use((req, res, next) => {
    console.log(res);
    next();
});



/** Https 配置 */
var privateKey  = fs.readFileSync('sslcert/www.mona2544.top.key', 'utf8');
var certificate = fs.readFileSync('sslcert/www.mona2544.top.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};




var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(ServerConfig.httpPort);
httpsServer.listen(ServerConfig.httpsPort);