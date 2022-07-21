const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
const testDataUser = require('../data').users;
const db = require('../db/db');
const ApiError = require('../exceptions/api-error');

class AuthController {

    async testRegister (req, res, next) {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return next(ApiError.BadRequest('Некоректні дані при реєстрації', errors.array()))
                }

                const {email, password, name} = req.body;
                const candidate = testDataUser.find(item => {
                    return item.email == email
                });
                if (candidate) {
                    return res.status(400).json({ message: 'Такий користувач вже існує', resultCode: 1})
                }
                //Test Data:

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
                // `, ['admin@gmail.com', hash1, 'user@gmail.com', hash2, 'teach1@gmail.com', hash3, 'teach2@gmail.com', hash4, 'teach3@gmail.com', hash5, 'teach4@gmail.com', hash6 ]);
                res.status(201).json({ message: 'Користувача створено', resultCode: 0 })
            } catch (e) {
                next(e);
            }
    }
    async testLogin (req, res, next) {
        try {
            const {email, password} = req.body;
            const {rows} = await db.query(`SELECT * from public."Credentials" WHERE email = $1`, [email]);
            const user = rows[0];

            if (!user) {
                throw ApiError.BadRequest('Користувача не знайдено');
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) {
                throw ApiError.BadRequest('Неправильний пароль');
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
        }
    }

    async testCreateSchool (req, res) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректні дані при реєстрації'
                })
            }

            res.status(201).json({ message: 'Школу створено', resultCode: 0 })
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

module.exports = new AuthController();
