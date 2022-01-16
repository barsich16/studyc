const {Router} = require('express');
const router = Router();
const UserController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
// /api/user/profile
router.get('/profile', authMiddleware, UserController.testGetProfileInfo);
router.get('/class/:id', authMiddleware, UserController.testGetClassInfo);
router.get('/marks', authMiddleware, UserController.testGetMarksInfo);


module.exports = router;
