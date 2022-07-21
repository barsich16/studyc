const db = require('../db/db');
const ApiError = require('../exceptions/api-error');
const {findLessonSchedule, findUserLessonSchedule} = require("../modules/helpers");

class UserController {
    async testGetProfileInfo(req, res, next) {
        try {
            const user = await db.query(`SELECT surname, name, patronymic, role, birthdate, phone,
                (select number from "Classes" where "Classes".id = "Users".class_id) AS class_number,
                (select letter from "Classes" where "Classes".id = "Users".class_id) AS class_letter,
                (select id from "Classes" where "Classes".id = "Users".class_id) as class_id,
                (select name from "Schools" where "Schools".id = "Users".school_id) AS school,
                (select email from "Credentials" where "Credentials".id = "Users".credentials_id)
                from "Users" WHERE id = $1`, [req.user.userId]);
            if (!user) {
                ApiError.BadRequest('Не знайшлися дані')
            }
            res.json(user.rows[0]);

        } catch (e) {
            next(e)
        }
    }

    async getClass(req, res) {
        try {
            const {userId, role} = req.user;
            const {rows: classId} = await db.query(`
                select class_id from "Users" where id = $1`, [userId]);
            if (classId.length === 0 && role !== 'pupil') { //не є керівником
                res.json({message: 'Ви не являєтесь класним керівником', isNotClassTeacher: true});
            }

            const response = {};
            const {rows: classmates} = await db.query(`
                select id, surname, name, patronymic, role, birthdate, phone, (select email from "Credentials" where "Credentials".id = "Users".credentials_id), state from "Users"
                where class_id = $1`, [classId[0].class_id]);
            response.classPupils = classmates.filter(item => item.role === 'pupil');

            if (role === 'pupil') {
                response.classTeacher = classmates.find(item => item.role !== 'pupil');
            }
            res.json(response);
        } catch (e) {
            res.status(500).json('Помилка при пошуку інформації про клас');
        }
    }

    async getAllMarks(req, res) {
        try {
            const userId = +req.params.pupilId;
            const {rows: subjects} = await db.query(`select id, name from "Subjects" 
                where class_id = (select class_id from "Users" where id = $1)`, [userId]);
            const response = {pupilId: userId, subjects}

            res.json(response);
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async getMarks(req, res) {
        try {
            const {pupilId, subjectId} = req.params;
            const {rows: subjectInfo} = await db.query(`select Sub.other, Sub.link, Sub.other_materials, "Users".surname || ' ' || "Users".name || ' ' || "Users".patronymic as teacher_name, "Credentials".email from "Users" 
                RIGHT JOIN "Subjects" as Sub ON Sub.teacher_id = "Users".id 
                LEFT JOIN "Credentials" ON "Credentials".id = "Users".credentials_id where Sub.id = $1`, [subjectId])

            const {rows: marks} = await db.query(`select ROW_NUMBER() OVER() AS key, "Marks".creation_date, "Marks".mark, "StudyEvents".name, "TypesEvents".type from "StudyEvents" 
                LEFT JOIN "Marks" ON "Marks".event_id = "StudyEvents".id and "Marks".pupil_id = $1 and "Marks".subject_id = $2
                LEFT JOIN "TypesEvents" ON "StudyEvents".types_events_id = "TypesEvents".id
                where "StudyEvents".study_plan_id = (select plan_id from "Subjects" where id = $2)
                order by "TypesEvents".required_type, "StudyEvents".order_number`, [pupilId, subjectId]);

            res.json({id: +subjectId, marks, ...subjectInfo[0]});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async testUpdateProfileInfo(req, res) {
        try {
            res.json({message: 'Інформацію збережено'});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async getSchedule(req, res, next) {
        try {
            const classId = +req.params.classId;
            const {weekDays, currentSchedule} = await findLessonSchedule(classId);
            const {rows: subjects} = await db.query(`select id, name, 
                (select surname || ' ' || substring(name,1,1) || '. ' || substring(patronymic,1,1) || '.' as teacher_name from "Users" where id = "Subjects".teacher_id),
                (select cabinet from "StudyPlans" where id = "Subjects".plan_id)
                from "Subjects" where class_id = $1`, [classId]);

            res.json({weekDays, subjects, currentSchedule});
        } catch (e) {
            next(e)
        }
    }
    async getMySchedule(req, res, next) {
        try {
            const {role, userId} = req.user;
            const {weekDays, currentSchedule} = await findUserLessonSchedule(role, userId);
            const specificQuery = role === 'pupil'
                ? `select id, name, 
                (select surname || ' ' || substring(name,1,1) || '. ' || substring(patronymic,1,1) || '.' as variable from "Users" where id = "Subjects".teacher_id),
                (select cabinet from "StudyPlans" where id = "Subjects".plan_id)
                from "Subjects" where class_id = (select class_id from "Users" where id = $1)`
                : `select id, name, 
                (select number as variable from "Classes" where id = "Subjects".class_id),
                (select letter from "Classes" where id = "Subjects".class_id),
                (select cabinet from "StudyPlans" where id = "Subjects".plan_id)
                from "Subjects" where teacher_id = $1`;

            let {rows: subjects} = await db.query(specificQuery, [userId]);
            if (role !== 'pupil') {
                subjects.forEach(item => {
                    if (item.letter) {
                        item.variable = item.variable + '-' + item.letter;
                    }
                    delete item.letter;
                })
            }

            res.json({userId, weekDays, subjects, currentSchedule});
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();
