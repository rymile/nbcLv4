const { Posts } = require("../models");

class PostRepository {
  findAllPost = async () => {
    // ORM인 Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const posts = await Posts.findAll();

    return posts;
  };

  createPost = async (title, content, userId) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const createPostData = await Posts.create({
      title,
      content,
      UserId: userId,
    });
    return createPostData;
  };

  putPost = async (postId, title, content) => {
    const modifyData = await Posts.update(
      {
        title,
        content,
      },
      {
        where: {
          postId,
        },
      }
    );
    return modifyData;
  };

  deletePost = async (postId) => {
    const deletedPost = await Posts.destroy({
      where: {
        postId: postId,
      },
    });

    return deletedPost;
  };
}

module.exports = PostRepository;
