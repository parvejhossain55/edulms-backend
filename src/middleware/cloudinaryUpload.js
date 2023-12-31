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
/*
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/zip",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`${file.mimetype} are not allow`));
    }
  },
  limits: 2 * 1024 * 1024,
});
*/

// Assignment file upload middleware
const assignmentUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/zip") {
      cb(null, true);
    } else {
      cb(new Error("Only zip files are allowed"));
      /*const error = new Error("Only zip files are allowed");
      error.statusCode = 400;
      cb(error);*/
    }
  },
  limits: 2 * 1024 * 1024,
});

// Middleware function to upload file to Cloudinary
const uploadAssignmentToCloudinary = (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    cloudinary.uploader.upload(
      req.file.path,
      { resource_type: "raw", folder: "zip_files" },
      (error, result) => {
        if (error) {
          return res
            .status(400)
            .send({ error: "Error uploading file to Cloudinary" });
        }

        req.file.cloudinaryId = result.public_id;
        req.file.cloudinaryUrl = result.secure_url;
        return next();
      }
    );
  } catch (err) {
    next(err);
  }
};


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
  limits: 2 * 1024 * 1024,
});

const uploadToCloudinary = (req, res, next) => {
  try {
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
      next();
    });
  } catch (err) {
    next(err);
  }
};

const deleteFile = async (publicId) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { upload, assignmentUpload, uploadToCloudinary, deleteFile, uploadAssignmentToCloudinary };
