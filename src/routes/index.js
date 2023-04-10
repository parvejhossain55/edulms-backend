<<<<<<< HEAD
const router = require('express').Router();
const authRoutes = require('./authRoutes');
const courseCategoryRoutes = require('./courseCategoryRoutes');
const courseRoutes = require('./courseRoutes');
const rolePermissionRoutes = require('./rolePermissionRoutes');
const userRoutes = require('./userRoutes');
const courseModuleRoutes = require('./courseModuleRoutes');
const courseContentRoutes = require('./courseContentRoutes');

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/course', courseModuleRoutes);
router.use('/course', courseContentRoutes);
router.use('/course', courseCategoryRoutes);
router.use('/roles', rolePermissionRoutes);
router.use('/users', userRoutes);
=======
const router = require("express").Router();
const authRoutes = require("./authRoutes");
const courseCategoryRoutes = require("./courseCategoryRoutes");
const courseRoutes = require("./courseRoutes");
const rolePermissionRoutes = require("./rolePermissionRoutes");
const userRoutes = require("./userRoutes");
const teacherRoutes = require("./teacherRoutes");

router.use("/auth", authRoutes);
router.use("/course", courseRoutes);
router.use("/course", courseCategoryRoutes);
router.use("/roles", rolePermissionRoutes);
router.use("/users", userRoutes);
router.use("/teacher", teacherRoutes);
>>>>>>> 76294c9 (apply teacher api create)

module.exports = router;
