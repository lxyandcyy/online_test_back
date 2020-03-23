var express = require("express");
var app = express();
var bodyParser = require("body-parser");
let user = require("./routes/user");
let cors = require("cors");

// 解决cors跨域问题
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/user", user);

app.listen(6001, function() {
  console.log("服务器打开了--> http://localhost:6001/");
});
