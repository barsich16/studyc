const crypto = require("crypto");
const db = require('../db/db');
const ApiError = require('../exceptions/api-error')
const {findLessonSchedule} = require("../modules/helpers");

const selectEmployees = async (user) => {

    const employees = await db.query(`SELECT id AS key, surname, name, patronymic, role, birthdate, phone, state, class_id,
                (select number from "Classes" where "Classes".id = "Users".class_id) AS class_number,
                (select letter from "Classes" where "Classes".id = "Users".class_id) AS class_letter,
                (select email from "Credentials" where "Credentials".id = "Users".credentials_id) AS email,
                (select verified from "Credentials" where "Credentials".id = "Users".credentials_id) AS verified
                from "Users" WHERE school_id = $1 and NOT id = $2`, [user.school, user.userId]);
    if (user.role === 'admin' || user.role === 'headteacher') {
        return employees.rows;
    }
    if (user.role === 'teacher') {
        const filteredEmployees = employees.rows.filter(employee => employee.state === 'confirmed');

        return filteredEmployees;
    }
    if (user.role === 'pupil') {
        const filteredEmployees = employees.rows.filter(employee => employee.state === 'confirmed');
        const newArray = filteredEmployees.map(employee => {
            return {
                surname: employee.surname, name: employee.name, patronymic: employee.patronymic,
                role: employee.role, birthdate: employee.birthdate,
                class: employee.class_number + '' + employee.class_letter, email: employee.email
            }
        });
        return newArray;
    }
}
const findClasses = async (school) => {
    try {
        let classes = await db.query(`select id as key, number, letter, creation_year, description, code, 
                array(SELECT DISTINCT creation_year FROM "Subjects" where class_id = "Classes".id) as study_years,
                (select surname || ' ' || name || ' ' || patronymic as class_teacher from "Users" where "Users".class_id = "Classes".id and not role = 'pupil'),
                (select count(*) as pupil_count from "Users" where "Users".class_id = "Classes".id and role = 'pupil')
                from "Classes" where school_id = $1`, [school]);
        if (!classes) {
            throw ApiError.BadRequest('Не знайдено даних)')
        }
        classes = classes.rows.map(item => {
            if (item.creation_date) {
                item.creation_date = new Date(item.creation_date).toLocaleDateString("sq-AL", {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
            return item;
        })
        return classes;
    } catch (e) {
        throw e;
    }
}

class AdminController {
    async getEmployees(req, res, next) {
        try {
            const employees = await selectEmployees(req.user);

            if (!employees) {
                throw ApiError.BadRequest('Не знайдено даних(')
            }
            res.json(employees);
        } catch (e) {
            next(e)
        }
    };

    async getClasses(req, res, next) {
        try {
            const classes = await findClasses(req.user.school);
            res.json(classes);
        } catch (e) {
            next(e)
        }
    };

    async createClass(req, res, next) {
        try {
            const {number, letter, teacher} = req.body;

            const checkUnique = letter
                ? await db.query(`select * from "Classes" where school_id = $1 and number = $2 and letter = $3`, [req.user.school, number, letter])
                : await db.query(`select * from "Classes" where school_id = $1 and number = $2 and letter is null`, [req.user.school, number])

            if (checkUnique.rowCount > 0) {
                throw ApiError.BadRequest('Такий клас вже існує')
            }
            const code = crypto.randomBytes(3).toString('hex');
            const insertClass = await db.query(`INSERT INTO "Classes" (number, letter, school_id, creation_date, code) 
                VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING id`, [number, letter, req.user.school, code]);

            if (teacher) {
                const appointTeacher = await db.query(`UPDATE "Users" SET class_id = $1 WHERE id = $2;`, [insertClass.rows[0].id, +teacher]);
            }
            const classes = await findClasses(req.user.school);

            res.json({message: 'Клас створено', classes, newClassId: insertClass.rows[0].id});
        } catch (e) {
            next(e)
        }
    }

    async appointClassTeacher(req, res, next) {
        try {
            const {classId, teacherId} = req.body;
            await db.query(`UPDATE "Users" SET class_id = $1 WHERE id = $2`, [classId, teacherId]);
            res.json({message: 'Класного керівника змінено'});
        } catch (e) {
            next(e)
        }
    };

    async getAppointment(req, res, next) {
        try {
            const classId = req.params.classId;
            if (!classId) {
                throw ApiError.BadRequest('Невірні дані');
            }
            const {rows: subjects} = await db.query(`select id, name, teacher_id from "Subjects" where class_id = $1`, [classId]);
            res.json(subjects);
        } catch (e) {
            next(e)
        }
    };

    async getAllClassSubjects(req, res, next) {
        try {
            const {classId, year} = req.params;
            const {rows: subjects} = await db.query(`select id, name from "Subjects" 
                where class_id = $1 and creation_year = $2`, [classId, year]);
            const response = {classId: +classId, year: +year, subjects};

            res.json(response);
        } catch (e) {
            next(e)
        }
    };

    async updateAppointment(req, res, next) {
        try {
            let {classId, changedSubjects = null} = req.body;
            const promises = [];

            if (changedSubjects) {
                const {addedEvents = [], deletedEvents = [], updatedEvents = []} = changedSubjects;
                if (deletedEvents.length > 0) {
                    for (const deletedEvent of deletedEvents) {//видаляємо зв'язок з батьківської таблиці багато до багатьох
                        const deleteEvent = db.query(`
                            DELETE FROM "Subjects" where id = $1`,
                            [deletedEvent]
                        );
                        promises.push(deleteEvent);
                    }
                }
                if (addedEvents.length > 0) {
                    for (const addedEvent of addedEvents) {//видаляємо зв'язок з батьківської таблиці багато до багатьох
                        const addEvent = db.query(`
                            insert into "Subjects" (name, teacher_id, class_id) values ($1, $2, $3)`,
                            [addedEvent.name, addedEvent.teacher_id, classId]);
                        promises.push(addEvent);
                    }
                }
                if (updatedEvents.length > 0) {
                    for (const updatedEvent of updatedEvents) {
                        const updateEvent = db.query(`
                            UPDATE "Subjects" SET name = $1, teacher_id = $2, class_id = $3 where id = $4`,
                            [updatedEvent.name, updatedEvent.teacher_id, classId, updatedEvent.id]
                        );
                        promises.push(updateEvent);
                    }
                }
            }

            await Promise.all(promises);
            const {rows: subjects} = await db.query(`select id, name, teacher_id from "Subjects" where class_id = $1`, [classId]);

            res.json({message: 'Дані оновлено', subjects});

        } catch (e) {
            res.status(500).json('Помилка при пошуку ');
        }
    };

    async changeState(req, res, next) {
        try {
            const {id, state} = req.body;
            await db.query(`UPDATE "Users" SET state = $1 WHERE id = $2;`, [state, +id]);
            res.json({message: 'Стан успішно змінено'});
        } catch (e) {
            next(e)
        }
    };

    async changeRoleEmployees(req, res, next) {
        try {
            const {id, role} = req.body;
            await db.query(`UPDATE "Users" SET role = $1 WHERE id = $2;`, [role, id]);

            res.json({message: 'Роль успішно змінено'});
        } catch (e) {
            next(e)
        }
    };

    async updateSchedule(req, res, next) {
        try {
            const promises = [];
            const {deletedItems, insertedItems, classId} = req.body;

            const changeSchedule = (dataItem, type) => {
                const params = [dataItem.number_lesson, dataItem.weekday_id, classId, dataItem.subjectId,];
                let query = '';
                if (type === 'insert') {
                    query = `INSERT INTO "Schedules" (number_lesson, weekday_id, class_id, subject_id) VALUES ($1, $2, $3, $4)`
                } else if (type === 'delete') {
                    if (dataItem.subjectId) {
                        query = `delete from "Schedules" where number_lesson = $1 and weekday_id = $2 and class_id = $3 and subject_id = $4`
                    } else { //якщо елемент є вікном
                        params.splice(3, 1);
                        query = `delete from "Schedules" where subject_id is null and number_lesson = $1 and weekday_id = $2 and class_id = $3`
                    }
                }

                const request = db.query(query, params);
                promises.push(request);
            }

            deletedItems.forEach(item => changeSchedule(item, 'delete'));
            insertedItems.forEach(item => changeSchedule(item, 'insert'));

            await Promise.all(promises);
            const {currentSchedule} = await findLessonSchedule(classId);
            res.json({message: 'Розклад оновлено', currentSchedule});
        } catch (e) {
            next(e)
        }
    }

    async moveToNextYear(req, res, next) {
        try {
            const {withSubjects} = req.body;
            res.json('Ok');
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new AdminController();
