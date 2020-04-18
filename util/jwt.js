let jwt = require("jsonwebtoken");
let token = jwt.sign(
  { exp: Math.floor(Date.now() / 1000) + 60 * 60 },
  { user_id: req.body.user_id },
  "secret"
);
