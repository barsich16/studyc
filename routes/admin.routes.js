const {Router} = require('express');
// const {check, validationResult} = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const AdminController = require('../controller/admin.controller')

router.get('/employees', authMiddleware, AdminController.getEmployees); // добавить валідацію
// router.post('/login', AuthController.testLogin); // валідацію

module.exports = router;
