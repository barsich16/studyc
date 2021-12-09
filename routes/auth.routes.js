const {Router} = require('express');
const router = Router();
const AuthController = require('../controller/auth.controller')
// /api/auth/register
router.post('/register', AuthController.testRegister); // добавить валідацію
router.post('/login', AuthController.testLogin); // валідацію

module.exports = router;
