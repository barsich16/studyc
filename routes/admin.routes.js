const {Router} = require('express');
// const {check, validationResult} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const AdminController = require('../controller/admin.controller')

router.get('/employees', authMiddleware, AdminController.getEmployees); // добавить валідацію
router.get('/classes', authMiddleware, AdminController.getClasses); // добавить валідацію
router.post('/classes', authMiddleware, AdminController.createClass); // добавить валідацію
router.put('/changeState', authMiddleware, AdminController.changeState); // добавить валідацію
router.put('/roleEmployees', authMiddleware, AdminController.changeRoleEmployees); // добавить валідацію
// router.post('/login', AuthController.testLogin); // валідацію

module.exports = router;
