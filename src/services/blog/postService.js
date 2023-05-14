const error = require("../../helpers/error");
const { deleteFile } = require("../../middleware/cloudinaryUpload");
const Post = require("../../models/Post");

exports.createPost = async (postData) => {
  try {
    const post = new Post(postData);
    return await post.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getPosts = async () => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("category", "name");
    return posts;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getPostById = async (postId) => {
  try {
    const post = await Post.findById(postId)
      .populate("author", "firstName lastName picture email")
      .populate("category", "name");
    if (!post) {
      throw error("Post Not Found", 404);
    }
    post.views += 1;
    return await post.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.updatePostById = async (postId, postData, file) => {
  try {
    const { title, slug, category, content, isFeature } = postData;
    let post;

    if (!file) {
      post = await Post.findById(postId);

      if (!post) {
        throw error("Post not found", 400);
      }

      post.title = title;
      post.slug = slug;
      post.category = category;
      post.content = content;
      post.isFeatured = isFeature;

      return await post.save();
    }

    post = await Post.findById(postId);
    // delete previous uploaded file
    await deleteFile(post.thumbnail.public_id);

    post.title = title;
    post.slug = slug;
    post.category = category;
    post.content = content;
    post.isFeatured = isFeature;
    post.thumbnail = {
      public_id: file?.cloudinaryId,
      secure_url: file?.cloudinaryUrl,
    };

    return await post.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.deletePostById = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    await post.remove();
    return post;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.searchPosts = async (searchQuery) => {
  try {
    const posts = await Post.find(searchQuery)
      .populate("author", "username")
      .populate("category", "name");
    return posts;
  } catch (err) {
    throw error(err.message, err.status);
  }
};
