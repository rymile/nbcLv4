const express = require("express");
const { Comments, Posts } = require("../models");
const authMiddleware = require("../middelwares/auth-middleware");
const router = express.Router();

// 댓글 작성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  const newComment = await Comments.create({
    PostId: postId,
    UserId: userId,
    comment,
  });

  return res.status(201).json({ data: newComment });
});

// 댓글 전체 조회
router.get("/comments", async (req, res) => {
  const comments = await Comments.findAll({
    attributes: [
      "commentId",
      "PostId",
      "UserId",
      "comment",
      "createdAt",
      "updatedAt",
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ data: comments });
});

// 댓글 상세 조회
router.get("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comments.findOne({
    attributes: [
      "commentId",
      "PostId",
      "UserId",
      "comment",
      "createdAt",
      "updatedAt",
    ],
    where: { commentId },
  });

  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }

  return res.status(200).json({ data: comment });
});

// 댓글 수정
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;
  const { comment } = req.body;

  const existingComment = await Comments.findOne({
    where: { commentId, UserId: userId },
  });

  if (!existingComment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }

  await Comments.update({ comment }, { where: { commentId, UserId: userId } });

  return res.status(200).json({ message: "댓글이 수정되었습니다." });
});

// 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { commentId } = req.params;

  const existingComment = await Comments.findOne({
    where: { commentId, UserId: userId },
  });

  if (!existingComment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }

  await Comments.destroy({ where: { commentId, UserId: userId } });

  return res.status(200).json({ message: "댓글이 삭제되었습니다." });
});

module.exports = router;
