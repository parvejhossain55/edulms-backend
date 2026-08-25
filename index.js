const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const app = express();
require("dotenv").config();
const { readdirSync } = require("fs");
const RoleModel = require("./models/Role");
const projectRoles = require("./dbSeed/projectRoles");
const PermissionModel = require("./models/Permission");
const { permissionsDocuments } = require("./dbSeed/projectPermissions");
const multer = require("multer");
const rolePermissionService = require("./services/rolePermissionService");
const userService = require("./services/userService");
const { employeeCreateService } = require("./services/userManage/manageUserService");

// Trust the first proxy (Vercel/Heroku/Nginx) so req.ip reflects the real client IP
app.set("trust proxy", 1);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Restrict CORS to known frontend origins; falls back open only when no origins are configured (local dev)
const allowedOrigins = [process.env.FRONTEND_URL, process.env.FONTEND_URL].filter(Boolean);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false); // no CORS headers -> browser blocks the request
    },
  })
);
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1000,
});
app.use(limiter);

app.get("/", (req, res) => {
  res.send(
    `<div style="text-align: center"><h3>Welcome to Lead Educare LMS Backend. <a href="${process.env.FONTEND_URL}">Visit our site</a></h3></div>`
  );
});

readdirSync("./routes").map((r) => app.use("/api/v1", require("./routes/" + r)));

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error occurred during file upload
    console.log("multer err", err);
    const message = "Error uploading file";
    const status = 400; // or any appropriate status code
    res.status(status).json({ error: message });
  } else if (err && err.message === "Only images are allowed") {
    // Custom error from fileFilter callback
    const message = err.message;
    const status = 400; // or any appropriate status code
    res.status(status).json({ error: message });
  } else if (err && err.message === "Only zip files are allowed") {
    // Custom error from fileFilter callback
    const message = err.message;
    const status = 400; // or any appropriate status code
    res.status(status).json({ error: message });
  } else {
    console.log(err);
    const message = err.message ? err.message : "Server Error Occurred";
    const status = err.status ? err.status : 500;
    res.status(status).json({
      error: status === 500 ? "Server Error Occurred" : message,
    });
  }
});

const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE)
  .then(async () => {
    console.log("DB Connected");

    projectRoles.map(async (role) => {
      await RoleModel.updateOne(
        { name: role.name },
        { $set: { name: role.name } },
        { upsert: true }
      );
    });
    permissionsDocuments.map(async (permission) => {
      await PermissionModel.updateOne(
        { name: permission.name },
        { $set: { name: permission.name } },
        { upsert: true }
      );
    });
    const superAdmin = {
      firstName: process.env.SUPER_ADMIN_FIRST_NAME,
      lastName: process.env.SUPER_ADMIN_LAST_NAME,
      email: process.env.SUPER_ADMIN_EMAIL,
      mobile: process.env.SUPER_ADMIN_MOBILE,
    };

    const isMatch = await userService.findUserByProperty("email", superAdmin.email);
    if (!isMatch) {
      const role = await rolePermissionService.roleFindByProperty("name", "superadmin");
      await employeeCreateService(
        {
          email: superAdmin.email,
          firstName: superAdmin.firstName,
          lastName: superAdmin.lastName,
          mobile: superAdmin.mobile,
          roleId: role?._id,
          createdBy: null,
        },
        superAdmin
      );
    }

    // Server Listen
    app.listen(port, () => {
      console.log(`Server run success on port ${port}`);
    });
  })
  .catch((err) => console.log(err));

module.exports = app;
