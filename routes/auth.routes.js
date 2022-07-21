const {Router} = require('express');
const {check} = require('express-validator');
const router = Router();
const AuthController = require('../controller/auth.controller')
// /api/auth/register
router.post(
    '/register',
    [
                check('email', 'Uncorrect').isEmail(),
                check('password', 'minLength').isLength({min: 6})
            ],
    AuthController.testRegister);
router.post('/login', AuthController.testLogin);

router.post(
    '/createSchool',
    [
        check('email', 'Uncorrect').isEmail(),
        check('password', 'minLength').isLength({min: 6})
    ],
    AuthController.testCreateSchool);

module.exports = router;
