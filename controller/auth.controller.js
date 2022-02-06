const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const config = require('config');
const {check, validationResult} = require('express-validator');
const testDataUser = require('../data').users;
const testClass = require('../data').class;
const db = require('../db');
const crypto = require("crypto");
const ApiError = require('../exceptions/api-error');


//тестовий юзер
const createTestUserStudent = async () => {
    const pass = await bcrypt.hash('user', 12);
    const u = {id: 19, name: 'Admin', surname: 'Adminenko', patronymic: 'Adminovych', classID: 2, email: 'user', password: pass, role: 1}
    testDataUser.push(u);
}
const createTestUserTeacher = async () => {
    const pass = await bcrypt.hash('teach', 12);
    const u = {id: 2, name: 'Test', surname: 'Teach', patronymic: 'Teacherovych', classID: 2, email: 'teach', password: pass, role: 2}
    testDataUser.push(u);
}
const createTestUserAdmin = async () => {
    const pass = await bcrypt.hash('admin', 12);
    const u = {id: 22, name: 'Директор', surname: 'admin', patronymic: 'Директорович', classID: '', email: 'admin', password: pass, role: 'admin'}
    testDataUser.push(u);
}
createTestUserStudent();
createTestUserTeacher();
createTestUserAdmin();
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
    async testRegister (req, res, next) {
            try {
                console.log("Body: ", req.body);
                const errors = validationResult(req);
                // const hash = crypto.randomBytes(3).toString('hex');
                // console.log("Hash:", hash);

                if (!errors.isEmpty()) {
                    return next(ApiError.BadRequest('Некоректні дані при реєстрації', errors.array()))
                    // return res.status(400).json({
                    //     errors: errors.array(),
                    //     message: 'Некоректні дані при реєстрації'
                    // })
                }

                const {email, password, name} = req.body;

                //const test = await db.query(`INSERT INTO public."Users" (type) VALUES ($1) RETURNING *`, [email]);
                //console.log("Query: ", test.rows[0]);

                const candidate = testDataUser.find(item => {
                    //console.log(item);
                    return item.email == email
                });
                if (candidate) {
                    return res.status(400).json({ message: 'Такий користувач вже існує', resultCode: 1})
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                // const hash1 = await bcrypt.hash('admin', 8);
                // const hash2 = await bcrypt.hash('user', 8);
                // const hash3 = await bcrypt.hash('teach1', 8);
                // const hash4 = await bcrypt.hash('teach2', 8);
                // const hash5 = await bcrypt.hash('teach3', 8);
                // const hash6 = await bcrypt.hash('teach4', 8);

                // const test = await db.query(`INSERT INTO public."Credentials" (email, password) VALUES ('admin@gmail.com', ${hash1}),
                //  ('user@gmail.com', ${hash2}),
                //  ('teach1@gmail.com', ${hash3}),
                //  ('teach2@gmail.com', ${hash4}),
                //  ('teach3@gmail.com', ${hash5}),
                //  ('teach4@gmail.com', ${hash6})`);

                // const test = await db.query(`INSERT INTO public."Credentials" (email, password)
                // VALUES ($1, $2),
                // ($3, $4),
                // ($5, $6),
                // ($7, $8),
                // ($9, $10),
                // ($11, $12)
                // `, ['admin@gmail.com', hash1, 'user@gmail.com', hash2, 'teach1@gmail.com', hash3, 'teach2@gmail.com', hash4, 'teach3@gmail.com', hash5, 'teach4@gmail.com', hash6 ]);

                // const test = await db.query(`INSERT INTO public."Users" (surname, name, patronymic, role, class_id, credentials_id, school_id, birthdate, phone)
                // VALUES ('Adminenko', 'Admin', 'Adminovych', 'admin', null, 8, 2, '1999-01-08', 380977897898)`);
                // const test = await db.query(`INSERT INTO public."Users" (surname, name, patronymic, role, class_id, credentials_id, school_id, birthdate, phone)
                // VALUES ('Userenko', 'User', 'Userovych', 'pupil', 3, 9, 2, '1999-01-08', 380977897898),
                // ('Teacherenko1', 'Teacher1', 'Teacherovych', 'teacher', 3, 10, 2, '1999-01-08', 380977897898),
                // ('Teacherenko2', 'Teacher2', 'Teacherovych', 'teacher', null, 11, 2, '1999-01-08', 380977897898),
                // ('Teacherenko3', 'Teacher3', 'Teacherovych', 'teacher', null, 12, 2, '1999-01-08', 380977897898),
                // ('Teacherenko4', 'Teacher4', 'Teacherovych', 'teacher', null, 13, 2, '1999-01-08', 380977897898)`);


                console.log(test);

                const user = {id: 2, name: name, surname: 'Adminenko', patronymic: 'Adm', classID: 2, email: email, password: hashedPassword, role: 1}
                testDataUser.push(user);
                // console.log(testDataUser);
                res.status(201).json({ message: 'Користувача створено', resultCode: 0 })
            } catch (e) {
                next(e);
                //res.status(500).json(e.message)
            }
    }
    async testLogin (req, res, next) {
        try {
            const {email, password} = req.body;
            const {rows} = await db.query(`SELECT * from public."Credentials" WHERE email = $1`, [email]);
            const user = rows[0];
            //console.log(user);
            // const user = testDataUser.find(item => item.email == email);
            if (!user) {
                throw ApiError.BadRequest('Користувача не знайдено');
                //return res.status(400).json({ message: 'Користувача не знайдено', resultCode: 1})
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                throw ApiError.BadRequest('Неправильний пароль');
                //return res.status(400).json({ message: 'Неправильний пароль', resultCode: 1})
            }
            const userinfo = await db.query(`SELECT * from public."Users" WHERE credentials_id = $1`, [user.id]);

            const token = jwt.sign(
                {userId: userinfo.rows[0].id, role: userinfo.rows[0].role, school: userinfo.rows[0].school_id}, //name, email
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '1d'}
            );
            //цифра 1 знизу це к-сть днів
            res.cookie('token', token, {maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true})
            res.json({token, userId: userinfo.rows[0].id, role: userinfo.rows[0].role, resultCode: 0});


        } catch (e) {
            next(e);
            // res.status(500).json({ message: e.message, resultCode: 1 })
        }
    }

    async testCreateSchool (req, res) {
        try {
            console.log("Body: ", req.body);
            const errors = validationResult(req);
            // const hash = crypto.randomBytes(3).toString('hex');
            // console.log("Hash:", hash);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректні дані при реєстрації'
                })
            }

            const {email, password, name, surname, schoolName, schoolRegion} = req.body;
            //const test = await db.query(`INSERT INTO public."TypesEvents" (type) VALUES ($1) RETURNING *`, [email]);
            //console.log("Query: ", test.rows[0]);
            console.log(schoolName);
            // const candidate = testDataUser.find(item => {
            //     //console.log(item);
            //     return item.email == email
            // });
            // if (candidate) {
            //     return res.status(400).json({ message: 'Такий користувач вже існує', resultCode: 1})
            // }
            // const hashedPassword = await bcrypt.hash(password, 12);
            // const user = {id: 2, name: name, surname: 'Adminenko', patronymic: 'Adm', classID: 2, email: email, password: hashedPassword, role: 1}
            // testDataUser.push(user);
            // // console.log(testDataUser);
            res.status(201).json({ message: 'Школу створено', resultCode: 0 })
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new AuthController();
