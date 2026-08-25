const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/media");
  },
  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExt = path.extname(file.originalname);
    cb(null, fileName + fileExt);
  },
});

const maxSize = 2 * 1024 * 1024; // max size 2MB

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cp) => {
    // allow image extension
    const isFileType =
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg";
    if (isFileType) {
      cp(null, true);
    } else {
      cp(null, false);
      return cp(new Error("Only jpg, jpeg, png format is allowed"));
    }
  },
  limits: maxSize,
});

module.exports = upload;
