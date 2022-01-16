const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const testDataUser = require('../data').users;
const testClass = require('../data').class;

//тестовий юзер
const createTestUserStudent = async () => {
    const pass = await bcrypt.hash('admin', 12);
    const u = {id: 19, name: 'Admin', surname: 'Adminenko', patronymic: 'Adminovych', classID: 2, email: 'admin', password: pass, role: 1}
    testDataUser.push(u);
}
const createTestUserTeacher = async () => {
    const pass = await bcrypt.hash('teach', 12);
    const u = {id: 2, name: 'Test', surname: 'Teach', patronymic: 'Teacherovych', classID: 2, email: 'teach', password: pass, role: 2}
    testDataUser.push(u);
}
createTestUserStudent();
createTestUserTeacher();
//

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
                    //console.log(item);
                    return item.email == email
                });
                if (candidate) {
                    return res.status(400).json({ message: 'Такий користувач вже існує', resultCode: 1})
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = {id: 2, name: 'Admin', surname: 'Adminenko', patronymic: 'Adm', classID: 2, email: email, password: hashedPassword, role: 1}
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
            res.json({token, userId: user.id, role: user.role, resultCode: 0});


        } catch (e) {
            res.status(500).json({ message: e.message, resultCode: 1 })
        }
    }
}

module.exports = new AuthController();
