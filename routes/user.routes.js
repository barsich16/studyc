const {Router} = require('express');
const router = Router();
const UserController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
// /api/user/profile
router.get('/profile', authMiddleware, UserController.testGetProfileInfo);
router.get('/class/:id', UserController.testGetClassInfo);
router.get('/marks/:id', UserController.testGetMarksInfo);
router.put('/profile', authMiddleware, UserController.testUpdateProfileInfo);


module.exports = router;
