const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/posts", postsController.getPosts);
router.post("/posts", postsController.createPost);
router.put("/posts/:postId", postsController.putPost);
router.delete("/posts/:postId", postsController.deletePost);

module.exports = router;
