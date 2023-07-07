const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middelwares/auth-middleware");
const router = express.Router();

//게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  const post = await Posts.create({
    UserId: userId,
    title,
    content,
  });
  return res.status(201).json({ data: post });
});

//게시글 전체조회
router.get("/posts", async (req, res) => {
  const posts = await Posts.findAll({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    where: { postId },
  });

  return res.status(200).json({ data: post });
});

// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { title, content } = req.body;

  const post = await Posts.findOne({ where: { postId, UserId: userId } });
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  await Posts.update({ title, content }, { where: { postId, UserId: userId } });

  return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;

  const post = await Posts.findOne({ where: { postId, UserId: userId } });
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  await Posts.destroy({ where: { postId, UserId: userId } });

  return res.status(200).json({ message: "게시글이 삭제되었습니다." });
});

module.exports = router;
