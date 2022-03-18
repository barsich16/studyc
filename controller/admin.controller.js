const crypto = require("crypto");
const db = require('../db');
const ApiError = require('../exceptions/api-error')

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
        console.log(employees);
        console.log(filteredEmployees);
        return filteredEmployees;
    }
    if (user.role === 'pupil') {
        const filteredEmployees = employees.filter(employee => employee.state === 'confirmed');
        const newArray = filteredEmployees.map(employee => {
            return {surname: employee.surname, name: employee.name, patronymic:employee.patronymic,
            role: employee.role, birthdate: employee.birthdate,
                class: employee.class_number + '' + employee.class_letter, email: employee.email}
        });
        return newArray;
    }
    // const filterEmployees = (surname, name, patronymic, role, birthdate,  ...param) => {
    //     return {
    //         surname, name, patronymic,
    //     }
    // }
}
const findClasses = async (school) => {
    try {
        let classes = await db.query(`select id as key, number, letter, creation_date, description, code, 
                (select surname || ' ' || name || ' ' || patronymic as class_teacher from "Users" where "Users".class_id = "Classes".id and not role = 'pupil'),
                (select count(*) as pupil_count from "Users" where "Users".class_id = "Classes".id and role = 'pupil')
                from "Classes" where school_id = $1`, [school]);
        if (!classes) {
            throw ApiError.BadRequest('Не знайдено даних)')
        }
        classes = classes.rows.map(item => {
            if(item.letter) {
                item.number+= `-${item.letter}`;
            }
            if(!item.class_teacher) {
                item.class_teacher = 'Відсутній';
            }
            if(item.creation_date) {
                item.creation_date = new Date(item.creation_date).toLocaleDateString("sq-AL",{ year: 'numeric', month: '2-digit', day: '2-digit' });
            }
            delete item.letter;

            return item;
        })
        return classes;
    } catch (e) {
        throw e;
    }
}
//const createClass = async (num)
class AdminController {
    async getEmployees (req, res, next) {
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
    async getClasses (req, res, next) {
        try {
            // let classes = await db.query(`select id as key, number, letter, creation_date, description, code,
            //     (select surname || ' ' || name || ' ' || patronymic as class_teacher from "Users" where "Users".class_id = "Classes".id and not role = 'pupil'),
            //     (select count(*) as pupil_count from "Users" where "Users".class_id = "Classes".id and role = 'pupil')
            //     from "Classes" where school_id = $1`, [req.user.school]);
            // if (!classes) {
            //     throw ApiError.BadRequest('Не знайдено даних(')
            // }
            // classes = classes.rows.map(item => {
            //     if(item.letter) {
            //         item.number+= `-${item.letter}`;
            //     }
            //     if(!item.class_teacher) {
            //         item.class_teacher = 'Відсутній';
            //     }
            //     if(item.creation_date) {
            //         item.creation_date = new Date(item.creation_date).toLocaleDateString("sq-AL",{ year: 'numeric', month: '2-digit', day: '2-digit' });
            //     }
            //     delete item.letter;
            //
            //     return item;
            // })
            const classes = await findClasses(req.user.school);

            //console.log(classes);
            res.json(classes);
        } catch (e) {
            next(e)
        }
    };
    async createClass (req, res, next) {
        try {
            const {number, letter, teacher} = req.body;
            console.log(req.body);

            const checkUnique = await db.query(`select * from "Classes" where school_id = $1 and number = $2 and letter = $3;`, [req.user.school, number, letter]);
            console.log(checkUnique.rowCount);
            if (checkUnique.rowCount > 0) {
                throw ApiError.BadRequest('Такий клас вже існує')
            }

            const code = crypto.randomBytes(3).toString('hex');
            console.log(code);
            const insertClass = await db.query(`INSERT INTO "Classes" (number, letter, school_id, creation_date, code) 
                VALUES ($1, $2, $3, CURRENT_DATE, $4) RETURNING id`, [number, letter, req.user.school, code]);
            console.log(insertClass.rows[0].id);

            if (teacher) {
                const appointTeacher = await db.query(`UPDATE "Users" SET class_id = $1 WHERE id = $2;`, [insertClass.rows[0].id, +teacher]);
                console.log(appointTeacher);
            }
            const classes = await findClasses(req.user.school);

            res.json({message: 'Клас створено', classes, newClassId: insertClass.rows[0].id});
        } catch (e) {
            next(e)
        }
    }
    async changeState (req, res, next) {
        try {
            //console.log(String(req.body.employees_id));

            const id_array = req.body.id;
            const newState = req.body.state;
            //const updatedEmployees = [];
            for (const id of id_array) {
                const newEmployee = await db.query(`UPDATE "Users" SET state = $1
            WHERE id = $2;`, [newState, +id]);
                console.log(newEmployee);
            }

            //const employees = await selectEmployees(req.user);
            // if (!employees) {
            //     throw ApiError.BadRequest('Не знайдено даних(')
            // }

            res.json('newEmployees');
        } catch (e) {
            next(e)
        }
    };
    async changeRoleEmployees (req, res, next) {
        try {
            const {id, role} = req.body;
            //console.log('id: ', typeof id, 'role: ', role);
            //const updatedEmployees = [];
            const request = await db.query(`UPDATE "Users" SET role = $1 WHERE id = $2;`, [role, id]);
            console.log(request);


            //const employees = await selectEmployees(req.user);
            // if (!employees) {
            //     throw ApiError.BadRequest('Не знайдено даних(')
            // }

            res.json('Ok');
        } catch (e) {
            next(e)
        }
    }
    // async testUpdateMarksInfo (req, res) {
    //     try {
    //         const {subjectName, newMarks} = req.body;
    //         const marksItem = Object.keys(testMarks).find(item => {
    //             return item === subjectName
    //         });
    //         if (!marksItem) {
    //             return res.status(400).json({ message: 'Не знайдено предмету', resultCode: 1})
    //         }
    //
    //         testMarks[marksItem] = newMarks;
    //         res.json({resultCode: 0, message: 'Зміни збережено'});
    //     } catch (e) {
    //         res.status(500).json('Помилка при пошуку оцінок');
    //     }
    // }
    // async testGetSubjectsInfo (req, res) {
    //     try {
    //         const userId = +req.params.id;
    //         // const subjectsArray = [];
    //         // Object.assign(subjectsArray, testDataSubjects);
    //         //console.log("here", subjectsArray);
    //         //{id: 1, name: 'Математика', teacherId: 2, classId: 2, studyPlan: 1},
    //         const subjects = testDataSubjects.filter(item => {
    //             return item.teacherId == userId
    //         });
    //         const result = subjects.map(item => {
    //             const eventIdArray = testDataPlansEvents.filter(planEvent => {
    //                 return planEvent.planId == item.studyPlan
    //             });
    //             console.log("eventID:", eventIdArray);
    //             return {
    //                 id: item.id,
    //                 name: item.name,
    //                 link: item.link,
    //                 class: testClass.find(classes => classes.id == item.classId),
    //                 studyPlan: testStudyPlans.find(plans => plans.id == item.studyPlan),
    //                 events:  eventIdArray.map(event => {
    //                     return testDataStudyEvents.find(ev => ev.id == event.eventId);
    //                 }),
    //             };
    //         })
    //         res.json({subjects: result, types: testTypesEvents});
    //
    //     } catch (e) {
    //         res.status(500).json('Помилка при пошуку');
    //     }
    // }
    // async testUpdateSubjectInfo (req, res) {
    //     try {
    //         console.log(req.body);
    //         const newSubjectInfo = req.body;
    //         // const oldSubjectInfo = testDataSubjects.find(subject => subject.id = newSubjectInfo.id);
    //         // oldSubjectInfo.link = newSubjectInfo.link;
    //         // oldSubjectInfo.other = newSubjectInfo.other;
    //         // const shouldChangedItems = testDataPlansEvents.filter(item => item.planId == oldSubjectInfo.studyPlan);
    //         // let shouldChangedEvents = shouldChangedItems.map(item => {
    //         //     return testDataStudyEvents.find(j => item.eventId == j.id);
    //         // })
    //         // console.log("Result: ", shouldChangedEvents);
    //         // shouldChangedEvents = newSubjectInfo.events;
    //         // console.log(testDataStudyEvents);
    //
    //         res.json({message: 'Збережено (Доробить)'});
    //     } catch (e) {
    //         res.status(500).json('Помилка при пошуку оцінок');
    //     }
    // }


}
module.exports = new AdminController();
