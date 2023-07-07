const express = require("express");
const { Users, UserInfos } = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();

//회원가입
router.post("/signup", async (req, res) => {
  const { email, password, name, age, gender, profileImage } = req.body;
  const existUser = await Users.findOne({ where: { email } });
  //동일한 e메일로 가입을 시도하는 유저가 있을 경우 에러를 발생시킨다.
  if (existUser) {
    return res.status(400).json({ message: "중복된 이메일입니다." });
  }

  //Users 테이블에 사용자 추가
  const user = await Users.create({ email, password });
  // UserInfos 테이블에 사용자 정보 추가
  const userinfo = await UserInfos.create({
    UserId: user.userId,
    name,
    age,
    gender,
    profileImage,
  });
  return res.status(201).json({ message: "회원가입 완료" });
});

//로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "유저 정보가 없습니다." });
  } else if (user.password !== password) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  const token = jwt.sign(
    {
      userId: user.userId,
    },
    "secret-key"
  );
  // 쿠키 발급
  res.cookie("auth", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공" });
});

//로그아웃
router.post("/logout", async (req, res) => {
  res.clearCookie("auth");
  return res.status(200).json({ message: "로그아웃 성공" });
});

//사용자 조회
router.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await Users.findOne({
    attributes: ["userId", "email", "createdAt", "updatedAt"],
    include: [
      {
        model: UserInfos,
        attributes: ["name", "age", "gender", "profileImage"],
      },
    ],
    where: { userId },
  });
  return res.status(200).json({ data: user });
});

module.exports = router;
