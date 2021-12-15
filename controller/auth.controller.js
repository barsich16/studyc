const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
let testDataUser = [
    {id: 1, name: 'Bohdan', surname: 'Borysenko', classID: 5, email: 'email@gmail.com', password: 'password', role: 1}
]
let testClass = [
    {id:1, name: '10-Б', teacherId: 1},
    {id:2, name: '10-А', teacherId: 2},

]
class AuthController {
    async fun (req, res) {
        try {
            const {email, password} = req.body;
            const candidate = {email: 'test@gmail.com', password: '111111'};  //TODO: треба шукать в базі. Зараз заглушка
            if (candidate) {
                return res.status(400).json({ message: 'Такий користувач вже існує'})
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            // надіслати юзера в базу з прийденим емейлом і захешованим паролем
            // TODO: закінчив на 34:25
        } catch (e) {
            res.status(500).json({ message: 'Щось пішло не так' })
        }
    }
    async testRegister (req, res) {
            try {
                console.log("Body: ", req.body);
                console.log("Items: ");
                const {email, password} = req.body;
                const candidate = testDataUser.find(item => {
                    console.log(item);
                    return item.email == email
                });
                if (candidate) {
                    return res.status(400).json({ message: 'Такий користувач вже існує', resultCode: 1})
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = {id: 2, name: 'Admin', surname: 'Adminenko', classID: 2, email: email, password: hashedPassword, role: 1}
                testDataUser.push(user);
                // console.log(testDataUser);
                res.status(201).json({ message: 'Користувача створено', resultCode: 0 })
            } catch (e) {
                res.status(500).json(e.message)
            }
    }
    async testLogin (req, res) {
        try {
            const {email, password} = req.body;
            const user = testDataUser.find(item => item.email == email);
            if (!user) {
                return res.status(400).json({ message: 'Користувача не знайдено', resultCode: 1})
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                return res.status(400).json({ message: 'Неправильний пароль', resultCode: 1})
            }

            const token = jwt.sign(
                {userId: user.id}, //name, email
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            );
            res.json({token, userId: user.id, resultCode: 0});


        } catch (e) {
            res.status(500).json({ message: e.message, resultCode: 1 })
        }
    }
}

module.exports = new AuthController();
