let jwt = require("jsonwebtoken");

class Token {
    constructor() {}

    // 通过唯一值生成token
    static createToken(condition) {
        let log_token = jwt.sign(
            {
                ...condition,
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            "secret"
        );
        return log_token;
    }
}

module.exports = Token;
