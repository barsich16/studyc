const {Router} = require('express');
const router = Router();
const UserController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
// /api/user/profile
router.get('/profile', authMiddleware, UserController.testGetProfileInfo);
router.put('/profile', authMiddleware, UserController.testUpdateProfileInfo);

router.get('/class', authMiddleware, UserController.getClass);

router.get('/marks/:pupilId/:subjectId', UserController.getMarks);
router.get('/marks/:pupilId', UserController.getAllMarks);

router.get('/schedule/:classId', authMiddleware, UserController.getSchedule);
router.get('/schedule', authMiddleware, UserController.getMySchedule);

module.exports = router;
