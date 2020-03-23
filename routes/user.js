var express = require("express");
let router = express.Router();
var Module = require("../db/module");

/*
路径：/user/regInfo
*/
router.post("/regInfo", function(req, res) {
  const req_body = req.body;

  const isReg = async function() {
    let UserInfo = await Module.UserInfo.findAll({
      where: {
        user_id: req.body.user_id
      }
    });
    return UserInfo;
  };

  // 向数据库添加新用户信息
  (async () => {
    let isreg = await isReg();
    console.log(typeof isreg);
    if (isreg == []) {
      console.log("asdf");
      let UserInfo = await Module.UserInfo.create({
        user_id: req_body.user_id,
        password: req_body.password
      });
      console.log("created: " + JSON.stringify(UserInfo));
    }
  })();
  res.end();
});

module.exports = router;
