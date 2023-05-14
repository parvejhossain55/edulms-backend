const FormHelper = require("../../helpers/FormHelper");
const Post = require("../../models/Post");
const postService = require("../../services/blog/postService");
const listService = require("../../services/common/listService");

exports.createPost = async (req, res, next) => {
  try {
    const { title, slug, content, author, category } = req.body;
    const filename = {
      public_id: req?.file?.cloudinaryId,
      secure_url: req?.file?.cloudinaryUrl,
    };

    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (FormHelper.isEmpty(slug)) {
      return res.status(400).json({ error: "Slug is required" });
    }
    if (FormHelper.isEmpty(content)) {
      return res.status(400).json({ error: "Content is required" });
    }
    if (!FormHelper.isIdValid(category)) {
      return res.status(400).json({
        error: "Provide a valid category",
      });
    }
    if (!FormHelper.isIdValid(author)) {
      return res.status(400).json({
        error: "Provide a valid author",
      });
    }

    const post = await postService.createPost({
      title,
      slug,
      content,
      author,
      category,
      thumbnail: filename,
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    let SearchRgx = { $regex: req.params.searchKeyword, $options: "i" };
    let SearchArray = [{ title: SearchRgx }, { content: SearchRgx }];
    const posts = await listService(req, Post, SearchArray);
    res.status(200).json(posts);
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
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// Update a post by id
exports.updatePostById = async (req, res, next) => {
  try {
    const { title, slug, content, category, isFeature } = req.body;

    if (FormHelper.isEmpty(title)) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (FormHelper.isEmpty(slug)) {
      return res.status(400).json({ error: "Slug is required" });
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
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
};

// update baki

// Add a comment to a post by id
exports.addCommentToPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post)
      return res.status(404).json({ success: false, error: "Post not found" });

    const comment = {
      text: req.body.text,
      author: req.user._id,
    };

    post.comments.unshift(comment);
    await post.save();
    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// Get 5 related post in same type
exports.getRelatedPosts = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const relatedPosts = await Post.find({
      $and: [
        { _id: { $ne: post._id } },
        { $or: [{ category: post.category }, { tags: { $in: post.tags } }] },
      ],
    }).limit(5);

    res.status(200).json({ relatedPosts });
  } catch (err) {
    next(err);
  }
};

// Get post by category
exports.getPostByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const posts = await Post.find({ category: categoryId }).populate(
      "author",
      "name email"
    );

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
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

// Get popular posts
exports.getPopularPosts = async (req, res, next) => {
  try {
    const popularPosts = await Post.find({ status: "published" })
      .populate("category", "name")
      .populate("author", "name")
      .sort({ views: -1 })
      .limit(10);

    res.status(200).json(popularPosts);
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
