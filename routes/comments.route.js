const express = require("express");
const { Comments, Posts } = require("../models");
const authMiddleware = require("../middelwares/auth-middleware");
const router = express.Router();

// 댓글 작성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  // userId는 로컬 유저로, postId는 파라미터값으로 받아오고, comment는 body로 내보낸다.
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { comment } = req.body;

  // 게시물이 없는 경우 res 호출
  const post = await Posts.findOne({ where: { postId } });
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }

  // 게시물이 있을 경우 댓글을 생성한다.
  const newComment = await Comments.create({
    // postId, UserId, comment를 생성한다.
    PostId: postId,
    UserId: userId,
    comment,
  });

  // 댓글이 잘 생성된 경우 생성된 댓글의 정보를 보여준다.
  return res.status(201).json({ data: newComment });
});

// 댓글 전체 조회
router.get("/comments", async (req, res) => {
  // Comments 테이블에서 참조하는 모든 필요한 정보를 찾는다.
  const comments = await Comments.findAll({
    attributes: [
      "commentId",
      "PostId",
      "UserId",
      "comment",
      "createdAt",
      "updatedAt",
    ],
    // 내림차순으로 정렬
    order: [["createdAt", "DESC"]],
  });
  // 댓글이 잘 조회되었을 경우 comments 정보를 보여준다.
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
