const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const router = Router();
const AuthController = require('../controller/auth.controller')
// /api/auth/register
router.post(
    '/register',
    [
                check('email', 'Uncorrect').isEmail(),
                check('password', 'minLength').isLength({min: 6})
            ],
    AuthController.testRegister); // добавить валідацію
router.post('/login', AuthController.testLogin); // валідацію
router.post(
    '/createSchool',
    [
        check('email', 'Uncorrect').isEmail(),
        check('password', 'minLength').isLength({min: 6})
    ],
    AuthController.testCreateSchool); // добавить валідацію
module.exports = router;
