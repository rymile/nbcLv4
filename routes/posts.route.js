const express = require("express");
const { Posts } = require("../models");
const authMiddleware = require("../middelwares/auth-middleware");
const router = express.Router();

//게시글 작성 - 작성 시 인증을 통과하도록 미들웨어를 추가
router.post("/posts", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { title, content } = req.body;

  // 게시글 작성
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
    // Posts테이블에서 다음과 같은 형식을 참조하여 찾아온다.
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    // 찾아온 글은 "createaAt"을 기준으로 내림차순으로 정렬한다.
    order: [["createdAt", "DESC"]],
  });
  return res.status(200).json({ data: posts });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  // 전체조회와 같은 부분
  const post = await Posts.findOne({
    attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
    // 상세조회는 형식을 찾아와서 postId로 한번 더 찾아서 가져온다.
    where: { postId },
  });

  return res.status(200).json({ data: post });
});

// 게시글 수정 - 수정 시 인증을 통과하도록 미들웨어를 추가
// 특정 게시글만 수정할 수 있도록 id값을 api로 받아옴
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { title, content } = req.body;

  // Posts 테이블에서 postId, userId를 찾아 게시글이 없을 때 에러 핸들링
  const post = await Posts.findOne({ where: { postId, UserId: userId } });
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  // if문을 통과하면 찾은 게시글의 title과 content를 수정한다.
  await Posts.update({ title, content }, { where: { postId, UserId: userId } });

  return res.status(200).json({ message: "게시글이 수정되었습니다." });
});

// 게시글 삭제 -- 삭제와 기본적으로 로직은 동일하다.
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
