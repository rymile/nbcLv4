const express = require("express");
const { Likes, Posts, Users } = require("../models");
const { Sequelize } = require("sequelize");
const router = express.Router();

// 게시글에 좋아요 추가
router.post("/like/:postId", async (req, res) => {
  try {
    // postId값은 파라미터로 받아온다.
    const { postId } = req.params;
    // userId, userInfoId의 값은 body값으로 받아온다. (userId, userInfoId는 회원가입 시 자동으로 생성됨)
    const { userId, userInfoId } = req.body;

    // 게시물 찾는 로직
    const post = await Posts.findByPk(postId); // Posts테이블에서 기본키를 찾는다.
    // 게시물이 없는 경우의 res를 내보낸다.
    if (!post) {
      return res.status(400).json({ message: "게시물을 찾을 수 없습니다." });
    }

    // 중복 좋아요 체크
    const existingLike = await Likes.findOne({
      // Likes테이블에서 userId와 postId의 값을 조건으로 찾는다.
      where: { UserId: userId, PostId: postId },
    });
    // 해당 유저가 게시물에 좋아요를 누른 경우는 좋아요 중복을 체크해 res를 내보낸다.
    if (existingLike) {
      return res.status(400).json({ message: "이미 좋아요한 게시물입니다." });
    }

    // 좋아요 추가
    await Likes.create({
      // 좋아요를 누르지 않은 유저의 경우 Likes테이블의 userId, userInfoId, postId를 각각 생성한다.
      // 각 id들은 Likes테이블에서 테이블에 N:1관계를 가진다.
      UserId: userId,
      UserInfoId: userInfoId,
      PostId: postId,
    });

    // 좋아요 개수 추가하는 로직
    await Posts.update(
      { likeCount: post.likeCount + 1 },
      { where: { postId: postId } }
    );

    return res.status(200).json({ message: "좋아요가 추가되었습니다." });
  } catch (error) {
    console.error("좋아요 추가 중 에러 발생", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 좋아요를 추가할 수 없습니다." });
  }
});

// 좋아요가 눌린 게시글 조회
router.get("/liked/", async (req, res) => {
  try {
    // Posts 테이블에서 찾아온다.
    const likedPosts = await Posts.findAll({
      attributes: [
        "postId",
        "title",
        "content",
        "createdAt",
        "updatedAt",
        [
          // 해당 문법으로 DB안에서 Posts의 likeCount 컬럼을 직접 찾아옴
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM Likes 
            WHERE Likes.PostId = Posts.postId
          )`),
          "likeCount",
        ],
      ],
      // 찾아온 후 Users테이블의 게시글 정보만 가져온다.
      include: [
        {
          model: Users,
          attributes: [],
        },
      ],
    });
    // 가져온 정보가 정사일 경우 likedPosts를 결과에 포함시킴
    return res.status(200).json(likedPosts);
    // 에러 핸들링 부분
  } catch (error) {
    console.error("좋아요가 눌린 게시글 조회 중 에러 발생", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 게시글을 조회할 수 없습니다." });
  }
});

module.exports = router;
