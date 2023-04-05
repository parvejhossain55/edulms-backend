const router = require('express').Router();
const authRoutes = require('./authRoutes');
const courseCategoryRoutes = require('./courseCategoryRoutes');
const courseRoutes = require('./courseRoutes');
const rolePermissionRoutes = require('./rolePermissionRoutes');
const userRoutes = require('./userRoutes');

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/course', courseCategoryRoutes);
router.use('/roles', rolePermissionRoutes);
router.use('/users', userRoutes);

module.exports = router;