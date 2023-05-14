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

// Get all posts
router.get(
  "/posts/:pageNo/:perPage/:searchKeyword",
  authVerifyMiddleware,
  PostController.getPosts
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
// router.delete(
//   "/posts/:id",
//   authVerifyMiddleware,
//   PostController.deletePostById
// );

// // Add comment to a specific post by ID
// router.post(
//   "/posts/:id/comments",
//   authVerifyMiddleware,
//   PostController.addCommentToPostById
// );

// // Get 5 related post in the same category
// router.get("/posts/:postId/related", PostController.getRelatedPosts);

// // Get posts by category
// router.get("/posts/category/:categoryId", PostController.getPostByCategory);

// // Get post by Tag
// router.get("/posts/tags", PostController.getPostsByTag);

// // Get popular post
// router.get("/posts/popular-post", PostController.getPopularPosts);

// // Route for searching posts
// router.get("/posts/search", PostController.searchPosts);

module.exports = router;
