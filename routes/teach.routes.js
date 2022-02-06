const {Router} = require('express');
const router = Router();
const TeachController = require('../controller/teach.controller');
const authMiddleware = require('../middleware/auth.middleware');
// беремо всі оцінки для вчительського розділу 'Оцінки'
router.get('/marks/:id', TeachController.testGetMarksInfo);
router.put('/marks/update', TeachController.testUpdateMarksInfo);
router.get('/subjects/:id', TeachController.testGetSubjectsInfo);
router.put('/subjects', TeachController.testUpdateSubjectInfo);
module.exports = router;
