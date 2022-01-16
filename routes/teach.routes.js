const {Router} = require('express');
const router = Router();
const TeachController = require('../controller/teach.controller');
const authMiddleware = require('../middleware/auth.middleware');
// беремо всі оцінки для вчительського розділу 'Оцінки'
router.get('/marks', authMiddleware, TeachController.testGetMarksInfo);
router.put('/marks/update', authMiddleware, TeachController.testUpdateMarksInfo);
router.get('/subjects', authMiddleware, TeachController.testGetSubjectsInfo);

module.exports = router;
