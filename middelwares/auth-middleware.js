const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { auth } = req.cookies;
    const [tokenType, token] = auth.split(" ");
    if (tokenType !== "Bearer") {
      return res
        .status(401)
        .json({ message: "토큰 타입이 일치하지 않습니다." });
    }

    const decodedToken = jwt.verify(token, "secret-key");
    const userId = decodedToken.userId;

    const user = await Users.findOne({ where: { userId } });
    if (!user) {
      res.clearCookie("auth");
      return res
        .status(401)
        .json({ message: "토큰 사용자가 존재하지 않습니다." });
    }
    res.locals.user = user;

    next();
  } catch (error) {
    res.clearCookie("auth");
    return res.status(401).json({
      message: "정상적인 요청이 아닙니다.",
    });
  }
};
