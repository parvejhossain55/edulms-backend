const FormHelper = require("../../helpers/FormHelper");
const Post = require("../../models/Post");
const postService = require("../../services/blog/postService");
const slugify = require("slugify");

exports.createPost = async (req, res, next) => {
  try {
    const { title, content, status, category } = req.body;
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };

    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (FormHelper.isEmpty(content)) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (!FormHelper.isIdValid(category)) {
      return res.status(400).json({
        error: "Provide a valid category",
      });
    }

    const post = await postService.createPost({
      title,
      slug: slugify(title, { lower: true }),
      content,
      author: req.auth._id,
      category,
      thumbnail: filename,
      status,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.params, req.body);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.getPostsforAdmin = async (req, res, next) => {
  try {
    const posts = await postService.getPostsforAdmin(req.params);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

// Get post by Category
exports.getPostByCategory = async (req, res, next) => {
  try {
    const postByCat = await postService.getPostByCategory(req);
    res.status(200).json(postByCat);
  } catch (err) {
    next(err);
  }
};

// Get a single post by id
exports.getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// Update a post by id
exports.updatePostById = async (req, res, next) => {
  try {
    const { title, content, category, isFeature } = req.body;

    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (FormHelper.isEmpty(content)) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (FormHelper.isEmpty(isFeature)) {
      return res.status(400).json({ error: "Feature is required" });
    }
    if (!FormHelper.isIdValid(category)) {
      return res.status(400).json({
        error: "Provide a valid category",
      });
    }
    req.body.slug = slugify(title, { lower: true });
    const post = await postService.updatePostById(
      req.params.id,
      req.body,
      req.file
    );
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// Delete a post by id
exports.deletePostById = async (req, res, next) => {
  try {
    const post = await postService.deletePostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.status(200).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};

// Add a comment to a post by id
exports.addCommentToPostById = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (FormHelper.isEmpty(comment)) {
      return res.status(400).json({ error: "Comment is rquired" });
    }
    const post = await postService.addCommentToPostById(req);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Toggle Like in Post
exports.toggleLikeInPost = async (req, res, next) => {
  try {
    const post = await postService.toggleLikeInPost(req);
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// Update Comment
exports.updateComment = async (req, res, next) => {
  try {
    const { comment } = req.body;
    if (FormHelper.isEmpty(comment)) {
      return res.status(400).json({ error: "Comment is rquired" });
    }
    const post = await postService.updateComment(req);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

// Get 5 related post in same type
exports.getRelatedPosts = async (req, res, next) => {
  try {
    const relatedPosts = await postService.relatedPost(req.params.postId);
    res.status(200).json(relatedPosts);
  } catch (err) {
    next(err);
  }
};

// Get 10 popular posts
exports.getPopularPosts = async (req, res, next) => {
  try {
    const popularPosts = await Post.find({ status: "published" })
      .populate("category", "name")
      .populate("author", "firstName lastName picture")
      .sort({ views: -1 })
      .limit(10);

    res.status(200).json(popularPosts);
  } catch (err) {
    next(err);
  }
};

// Get posts by tag
exports.getPostsByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;

    const posts = await Post.find({
      tags: { $in: [tag] },
      status: "published",
    })
      .populate("category", "name")
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

exports.searchPosts = async (req, res, next) => {
  const { query, tags } = req.query;

  try {
    // Build the search query
    const searchQuery = {
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
          ],
        },
        { tags: { $in: [tags] } },
        // { tags: { $in: tags.split(",") } },
      ],
    };

    // Find the posts matching the search query
    const posts = await Post.find(searchQuery)
      .populate("author", "username")
      .populate("category", "name");
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
