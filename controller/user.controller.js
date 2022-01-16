// import {testDataUser} from "./auth.controller";
const testDataUser = require('../data').users;
const testDataMarks = require('../data').pupilMarks;


class UserController {
    async testGetProfileInfo (req, res) {
        try {

            const candidate = testDataUser.find(item => {
                return item.id == req.user.userId
            });
            res.json(candidate);

        } catch (e) {
            res.status(500).json('Помилка при пошуку інформації користувача');
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
            res.json(testDataMarks);

        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

}
module.exports = new UserController();
