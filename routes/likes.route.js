const express = require("express");
const { Likes, Posts, Users } = require("../models");
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

    // 생성했을 경우 좋아요 카운트를 1 추가한다.
    post.likeCount += 1;
    // post요청을 보냈을 때 해당 요청을 save한다.
    await post.save();
    // 좋아요 추가 res 호출
    return res.status(200).json({ message: "좋아요가 추가되었습니다." });

    // 오류 발생 시 catch쪽의 에러를 발생시킨다.
    // ex) 1. userId나 postId가 없을 때
    //     2. body데이터에 userId와 userInfoId가 없을 때
  } catch (error) {
    console.error("좋아요 추가 중 에러 발생", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 좋아요를 추가할 수 없습니다." });
  }
});

// 좋아요가 눌린 게시글 조회 엔드포인트
router.get("/liked/", async (req, res) => {
  try {
    // Likes 모델을 사용하여 좋아요가 있는 게시글의 ID 목록을 조회합니다.
    const likedPostIds = await Likes.findAll({
      attributes: ["PostId"],
    });

    // 게시글 ID 목록을 배열로 추출합니다.
    const postIds = likedPostIds.map((likedPostId) => likedPostId.PostId);

    // 좋아요가 있는 게시글을 조회합니다.
    const likedPosts = await Posts.findAll({
      where: { postId: postIds },
    });

    return res.status(200).json(likedPosts);
  } catch (error) {
    console.error("좋아요가 눌린 게시글 조회 중 에러 발생", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 게시글을 조회할 수 없습니다." });
  }
});

// 좋아요 상세 조회 엔드포인트
router.get("/liked/:likeId", async (req, res) => {
  try {
    const { likeId } = req.params;

    // 좋아요 상세 정보를 조회합니다.
    const like = await Likes.findByPk(likeId, {
      include: [Posts, Users],
    });

    if (!like) {
      return res.status(404).json({ message: "좋아요를 찾을 수 없습니다." });
    }

    return res.status(200).json(like);
  } catch (error) {
    console.error("좋아요 상세 조회 중 에러 발생", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 좋아요를 조회할 수 없습니다." });
  }
});

module.exports = router;
