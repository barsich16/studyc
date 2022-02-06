// import {testDataUser} from "./auth.controller";
const testDataUser = require('../data').users;
const testDataMarks = require('../data').pupilMarks;
const db = require('../db');
const ApiError = require('../exceptions/api-error');

class UserController {
    async testGetProfileInfo (req, res, next) {
        try {

            const user = await db.query(`SELECT surname, name, patronymic, role, birthdate, phone,
(select number from "Classes" where "Classes".id = "Users".class_id) AS class_number,
(select letter from "Classes" where "Classes".id = "Users".class_id) AS class_letter,
(select name from "Schools" where "Schools".id = "Users".school_id) AS school
from "Users" WHERE id = $1`, [req.user.userId]);
            console.log(req.user.userId);
            if(!user) {
                ApiError.BadRequest('Не знайшлися дані')
            }
            res.json(user.rows[0]);

        } catch (e) {
            next(e)
            //res.status(500).json('Помилка при пошуку інформації користувача');
        }
    }
    async testGetClassInfo (req, res) {
        try {
            const classId = +req.params.id;
            if (!classId) {
                return res.status(500).json('Помилка при пошуку класу');
            }
            const classmates = testDataUser.filter(user => {
                return user.classID === classId && user.role === 1
            });

            const classTeacher = testDataUser.find(teacher => {
                return teacher.classID == classId && teacher.role === 2
            });
            res.json({
                classmates: classmates,
                classTeacher: classTeacher,
                resultCode: 0
            });
        } catch (e) {
            res.status(500).json('Помилка при пошуку інформації про клас');
        }
    }
    async testGetMarksInfo (req, res) {
        try {
            const userId = +req.params.id;
            console.log("User: ", userId);
            res.json(testDataMarks);
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }
    async testUpdateProfileInfo (req, res) {
        try {
            console.log(req.body);
            res.json({message: 'Інформацію збережено'});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

}
module.exports = new UserController();
