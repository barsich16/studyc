const {Router} = require('express');
const router = Router();
const TeachController = require('../controller/teach.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/marks/:id', authMiddleware, TeachController.getMarks);
router.put('/marks', authMiddleware, TeachController.updateMarks);

router.get('/plans', authMiddleware, TeachController.getPlans);
router.put('/plans', authMiddleware, TeachController.updatePlans);
router.delete('/plans', authMiddleware, TeachController.deletePlan);

router.get('/typesEvents', authMiddleware, TeachController.getTypesEvents);

router.get('/subjects/:id', TeachController.testGetSubjectsInfo);
router.put('/subjects', TeachController.testUpdateSubjectInfo);
module.exports = router;
