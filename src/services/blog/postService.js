const error = require("../../helpers/error");
const { deleteFile } = require("../../middleware/cloudinaryUpload");
const Post = require("../../models/Post");
const mongoose = require("mongoose");
const findOneByQuery = require("../common/findOneByQuery");
const ObjectId = mongoose.Types.ObjectId;

exports.createPost = async (postData) => {
  try {
    const post = new Post(postData);
    return await post.save();
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getPosts = async (query) => {
  try {
    const { pageNo = 1, perPage = 10, searchKeyword } = query;

    const matchQuery = { status: "published" };

    if (searchKeyword !== "0") {
      let SearchRgx = { $regex: searchKeyword, $options: "i" };
      let SearchArray = [{ title: SearchRgx }, { content: SearchRgx }];
      matchQuery.$or = SearchArray;
    }

    const posts = await Post.find(matchQuery)
      .populate({
        path: "author",
        select: "firstName lastName picture",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .select(
        "_id title slug content thumbnail isFeatured tags views likes category author"
      )
      .skip((parseInt(pageNo) - 1) * parseInt(perPage))
      .limit(parseInt(perPage));

    const count = await Post.countDocuments(matchQuery);
    const totalPages = Math.ceil(count / perPage);
    const currentPage = parseInt(pageNo);

    return {
      posts,
      totalPages,
      currentPage,
      totalPosts: count,
    };
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.getPostByCategory = async (req) => {
  try {
    const categoryId = req.params.categoryId;
    // const searchRgx = { $regex: req.params.searchKeyword, $options: "i" };
    const result = await Post.aggregate([
      {
        $match: {
          // $or: [{ title: searchRgx }, { content: searchRgx }],
          category: new ObjectId(categoryId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          content: 1,
          thumbnail: 1,
          isFeature: 1,
          tags: 1,
          views: 1,
          likes: 1,
          comment: 1,
          "author.firstName": 1,
          "author.lastName": 1,
          "author.picture": 1,
          "category._id": 1,
          "category.name": 1,
        },
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message, error.status);
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

    const checkPost = await findOneByQuery({ slug }, Post);
    if (checkPost) throw error("Title already exists, Must be Unique", 400);

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

exports.relatedPost = async (postId) => {
  try {
    const post = await Post.findById(postId);

    if (!post) throw error("Post not found", 404);

    const relatedPosts = await Post.find({
      $and: [
        { _id: { $ne: post._id } },
        { $or: [{ category: post.category }, { tags: { $in: post.tags } }] },
      ],
    })
      .populate("author", "firstName lastName picture")
      .populate("category", "name")
      .limit(3);
    return relatedPosts;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.addCommentToPostById = async (req) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) throw error("Post not found", 404);

    const comment = {
      comment: req.body.comment,
      author: req.auth._id,
    };

    post.comments.unshift(comment);
    await post.save();
    return post;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.updateComment = async (req) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const { comment } = req.body;
    const post = await Post.findById(postId);

    if (!post) throw error("Post not found", 404);

    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId
    );

    if (commentIndex === -1) throw error("Comment not found", 404);

    post.comments[commentIndex].comment = comment;
    await post.save();

    return post;
  } catch (err) {
    throw error(err.message, err.status);
  }
};

exports.toggleLikeInPost = async (req) => {
  try {
    const postId = req.params.postId;
    const userId = req.auth._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
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
