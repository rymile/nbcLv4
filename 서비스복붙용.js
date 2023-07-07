const PostRepository = require("../repositories/posts.repository");
const { post } = require("../routes/posts.route");

class PostService {
  PostRepository = new PostRepository();

  findAllPost = async () => {
    const allPost = await this.PostRepository.findAllPost();

    allPost.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allPost.map((post) => {
      return {
        postId: post.postId,
        title: post.title,
        content: post.content,
      };
    });
  };

  createPost = async (title, content, userId) => {
    if (!title || !content) {
      throw new Error("제목과 내용을 제공해야 합니다.");
    }
    const createPostData = await this.PostRepository.createPost(
      title,
      content,
      userId
    );
    return createPostData;
  };

  putPost = async (postId, title, content) => {
    if (!postId) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const modifyData = await this.PostRepository.putPost(
      postId,
      title,
      content
    );
    return modifyData;
  };

  deletePost = async (postId) => {
    if (!postId) {
      throw new Error("게시글이 존재하지 않습니다.");
    }
    const deleteData = await this.PostRepository.deletePost(postId);
    return deleteData;
  };
}

module.exports = PostService;
