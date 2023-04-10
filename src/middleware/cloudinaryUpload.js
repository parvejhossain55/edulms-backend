const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage
const storage = multer.diskStorage({});

// Create file upload middleware
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
  limits: { fileSize: 1024 * 1024 },
}).single("picture");

// Middleware function to upload file to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      return res
        .status(500)
        .send({ error: "Error uploading file to Cloudinary" });
    }

    req.file.cloudinaryId = result.public_id;
    req.file.cloudinaryUrl = result.secure_url;
    return next();
  });
};

module.exports = { upload, uploadToCloudinary };
