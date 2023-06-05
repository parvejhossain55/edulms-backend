const router = require("express").Router();
const {
  isAdmin,
  authVerifyMiddleware,
} = require("../middleware/authMiddleware");
const PostController = require("../controllers/blog/postController");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

router.post(
  "/posts",
  authVerifyMiddleware,
  isAdmin,
  upload.single("thumbnail"),
  uploadToCloudinary,
  PostController.createPost
);

// Get All Post by Category
router.get(
  "/posts/:categoryId/:pageNo/:perPage/:searchKeyword",
  PostController.getPostByCategory
);

// Get all posts
router.post(
  "/posts/:pageNo/:perPage/:searchKeyword",
  // authVerifyMiddleware,
  PostController.getPosts
);

// Get all posts for admin
router.get(
  "/blog/posts/:pageNo/:perPage/:searchKeyword",
  authVerifyMiddleware,
  PostController.getPostsforAdmin
);

// Get 3 related post in the same category
router.get("/posts/:postId/related", PostController.getRelatedPosts);

// Get popular post
router.get("/posts/popular-post", PostController.getPopularPosts);

// Get latest post
router.get("/posts/latest-post", PostController.getLatestPosts);

// Add comment to a specific post by ID
router.post(
  "/posts/:postId/comments",
  authVerifyMiddleware,
  PostController.addCommentToPostById
);

// Update Comment by post
router.put(
  "/posts/:postId/comments/:commentId",
  authVerifyMiddleware,
  PostController.updateComment
);

// Post Like
router.get(
  "/posts/:postId/like",
  authVerifyMiddleware,
  PostController.toggleLikeInPost
);
// Get a specific post by ID
router.get("/posts/:id", PostController.getPostById);

// // Update a specific post by ID
router.patch(
  "/posts/:id",
  authVerifyMiddleware,
  isAdmin,
  upload.single("thumbnail"),
  uploadToCloudinary,
  PostController.updatePostById
);

// // Delete a specific post by ID
router.delete(
  "/posts/:id",
  authVerifyMiddleware,
  PostController.deletePostById
);

// // Get post by Tag
// router.get("/posts-by-tag/:tag", PostController.getPostsByTag);

module.exports = router;
