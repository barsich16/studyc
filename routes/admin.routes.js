const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const AdminController = require('../controller/admin.controller')

router.get('/employees', authMiddleware, AdminController.getEmployees);
router.put('/roleEmployees', authMiddleware, AdminController.changeRoleEmployees);
router.put('/changeState', authMiddleware, AdminController.changeState);

router.get('/classes', authMiddleware, AdminController.getClasses);
router.post('/classes', authMiddleware, AdminController.createClass);
router.get('/classes/:classId/:year', authMiddleware, AdminController.getAllClassSubjects);

router.get('/appointment/:classId', authMiddleware, AdminController.getAppointment);
router.put('/appointment', authMiddleware, AdminController.updateAppointment);

router.put('/schedule', authMiddleware, AdminController.updateSchedule);

router.put('/classTeacher', authMiddleware, AdminController.appointClassTeacher);

router.put('/changeYear', authMiddleware, AdminController.moveToNextYear);

module.exports = router;
