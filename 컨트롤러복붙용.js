const PostService = require("../services/post.service");

class PostsController {
  postService = new PostService();

  //get 기능
  getPosts = async (req, res, next) => {
    const posts = await this.postService.findAllPost();
    res.status(200).json({ data: posts });
  };

  //post 기능
  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    let userId;

    if (res.locals.user) {
      userId = res.locals.user.userId;
    } else {
      return res.status(400).json({ error: "인증되지 않은 사용자입니다." });
    }
    try {
      const createdPost = await this.postService.createPost(
        title,
        content,
        userId
      );
      res.status(200).json({ data: createdPost });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //put기능
  putPost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    try {
      const modifyPost = await this.postService.putPost(postId, title, content);
      res.status(200).json({ data: modifyPost });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  //delte 기능
  deletePost = async (req, res, next) => {
    const { postId } = req.params;

    try {
      const deletePost = await this.postService.deletePost(postId);
      res.status(200).json({ data: deletePost });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

module.exports = PostsController;
