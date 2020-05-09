var express = require("express");
let router = express.Router();
let jwt = require("jsonwebtoken");

/*2
路径：/verify-token  验证log_token
*/
router.get("/", function (req, res) {
    let token = req.query[0];
    console.log(token);

    jwt.verify(token, "secret", (err, decoded) => {
        console.log("解析数据", decoded);

        if (decoded) {
            res.json({ valid: true, decoded: decoded, msg: "token有效" });
        } else {
            res.json({ valid: false, msg: "token已失效" }); //token已过期
        }
    });
});

module.exports = router;
