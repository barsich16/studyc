const testDataUser = require('../data').users;
const testDataSubjects = require('../data').subjects;
const testMarks = require('../data').globalMarks;
const testClass = require('../data').class;
const testStudyPlans = require('../data').studyPlans;
const testDataPlansEvents = require('../data').plansEvents;
const testDataStudyEvents = require('../data').studyEvents;
const testTypesEvents = require('../data').typesEvents;
const db = require('../db');
const ApiError = require('../exceptions/api-error');

class TeachController {
    async testGetMarksInfo(req, res) {
        try {
            const userId = +req.params.id;
            console.log("User: ", userId);
            //req.user.userId
            //{id: 1, name: 'Математика', teacherId: 2, classId: 2, studyPlan: 1},
            // const subjects = testDataSubjects.filter(item => {
            //     return item.teacherId == req.user.userId
            // })

            res.json(testMarks);

        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async testUpdateMarksInfo(req, res, next) {
        try {
            const {subjectName, newMarks} = req.body;
            const marksItem = Object.keys(testMarks).find(item => {
                return item === subjectName
            });
            if (!marksItem) {
                return res.status(400).json({message: 'Не знайдено предмету', resultCode: 1})
            }

            testMarks[marksItem] = newMarks;
            res.json({resultCode: 0, message: 'Зміни збережено'});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async testGetSubjectsInfo(req, res) {
        try {
            const userId = +req.params.id;

            const {rows} = await db.query(
                `select Sub.name, Sub.other, Sub.other_materials, Sub.id, Sub.link, Clas.id as class_id, Clas.number as class_name, Clas.letter as class_letter, 
                Stud.id as study_plan_id, Stud.name as study_plan_name, Stud.class_number from "Subjects" as Sub 
                LEFT JOIN "StudyPlans" as Stud ON Sub.plan_id = Stud.id 
                LEFT JOIN "Classes" as Clas ON Sub.class_id = Clas.id where Sub.teacher_id = $1`, [userId]
            );
            console.log(rows);

            // for (const subject of rows) {
            //     const queryEvents = await db.query(
            //         `select id, name, short_name, order_number, notes, (select id as id_type_event from "TypesEvents" where "TypesEvents".id = "StudyEvents".types_events_id)
            //             from "StudyEvents" where id in (select event_id from "plans_events" where plan_id = $1) ORDER BY order_number`, [subject.study_plan_id]
            //     );
            //     subject.events = queryEvents.rows;
            // }

            const typesStudyEvents = await db.query(`select * from "TypesEvents"`)

            res.json({subjects: rows, types: typesStudyEvents.rows});

        } catch (e) {
            res.status(500).json('Помилка при пошуку');
        }
    }

    async testUpdateSubjectInfo(req, res, next) {
        try {
            const newSubjectInfo = req.body;

            // const eventsId = await db.query(   //видаляємо зв'язок з батьківської таблиці багато до багатьох
            //     `DELETE FROM "plans_events" where plan_id = $1 returning event_id`, [newSubjectInfo.study_plan_id]
            // );
            //
            // for (const item of eventsId.rows) {    //видаляємо старі записи в StudyEvents
            //     await db.query(`DELETE FROM "StudyEvents" where id = $1`, [item.event_id]);
            // }
            //
            // const newEventsId = [];
            // console.log(newSubjectInfo);
            // if (newSubjectInfo.events.length > 0) {
            //     for (const newEvent of newSubjectInfo.events) {    //створюємо нові записи в StudyEvents
            //         const {rows} = await db.query(`
            //         INSERT INTO "StudyEvents" (name, short_name, types_events_id, order_number, notes)
            //         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
            //             [newEvent.name, newEvent.short_name, newEvent.id_type_event, newEvent.order_number, newEvent.notes]);
            //         newEventsId.push(rows[0].id);
            //     }
            //
            //     for (const eventId of newEventsId) { //створюємо зв'язок в батьківській таблиці багато до багатьох
            //         await db.query(
            //             `INSERT INTO "plans_events" (plan_id, event_id) VALUES ($1, $2)`,
            //             [newSubjectInfo.study_plan_id, eventId]
            //         );
            //     }
            // }

            await db.query(  //оновлюємо дані про предмет
                `Update "Subjects" set other_materials = $1, link = $2, other = $3, plan_id = $4 where id = $5`,
                [newSubjectInfo.other_materials, newSubjectInfo.link, newSubjectInfo.other, +newSubjectInfo.study_plan, +newSubjectInfo.id]
            );

            res.json({message: 'Дані оновлено'});
        } catch (e) {
            console.log(e);
            res.status(500).json('Помилка при пошуку ');
        }
    }

    async getPlans(req, res, next) {
        try {
            const userId = req.user.userId;
            const {rows} = await db.query(`select * from "StudyPlans" where teacher_id = $1`, [userId])

            for (const plan of rows) {
                const queryEvents = await db.query(
                    `select id, name, short_name, order_number, notes, (select id as id_type_event from "TypesEvents" where "TypesEvents".id = "StudyEvents".types_events_id)
                        from "StudyEvents" where id in (select event_id from "plans_events" where plan_id = $1) ORDER BY order_number`, [plan.id]
                );
                plan.events = queryEvents.rows;
            }
            console.log(rows);

            res.json({plans: rows});
            //res.json('Test');

        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async updatePlans(req, res, next) {
        try {
            const newPlan = req.body;
            console.log(newPlan);
            if (newPlan.isPlanNew) {
                console.log("This plan is NEW");

                const newStudyPlan = await db.query(  //створюємо новий план в StudyPlans
                    `INSERT INTO "StudyPlans" (name, teacher_id, class_number) 
                    VALUES ($1, $2, $3) Returning id`,
                    [newPlan.name, req.user.userId, newPlan.class_number]
                );
                newPlan.id = newStudyPlan.rows[0].id;
            } else {
                console.log("This plan is old");
                await db.query(
                    `Update "StudyPlans" set class_number = $1 where id = $2`,
                    [newPlan.class_number, newPlan.id]
                );

                const eventsId = await db.query(   //видаляємо зв'язок з батьківської таблиці багато до багатьох
                    `DELETE FROM "plans_events" where plan_id = $1 returning event_id`, [newPlan.id]
                );
                for (const item of eventsId.rows) {    //видаляємо старі записи в StudyEvents
                    await db.query(`DELETE FROM "StudyEvents" where id = $1`, [item.event_id]);
                }
            }

            const newEventsId = [];
            if (newPlan.events && newPlan.events.length > 0) {
                for (const newEvent of newPlan.events) {    //створюємо нові записи в StudyEvents
                    const {rows} = await db.query(`
                            INSERT INTO "StudyEvents" (name, short_name, types_events_id, order_number, notes)
                            VALUES ($1, $2, $3, $4, $5) RETURNING id`,
                        [newEvent.name, newEvent.short_name, newEvent.id_type_event, newEvent.order_number, newEvent.notes]);
                    newEventsId.push(rows[0].id);
                }

                for (const eventId of newEventsId) { //створюємо зв'язок в батьківській таблиці багато до багатьох
                    await db.query(
                        `INSERT INTO "plans_events" (plan_id, event_id) VALUES ($1, $2)`,
                        [newPlan.id, eventId]
                    );
                }
            }
            res.json({message: 'Дані оновлено', id: newPlan.id});
        } catch (e) {
            console.log(e);
            res.status(500).json('Помилка при пошуку ');
        }
    }

    async deletePlan(req, res, next) {
        try {
            const planId = req.body.planId;
            const {rows} = await db.query(
                `DELETE FROM "plans_events" where plan_id = $1 Returning event_id`,
                [planId]
            );
            console.log(rows);
            if(rows.length > 0) {
                const promises = [];
                for (const row of rows) {
                    const deleteEvent = db.query(`DELETE FROM "StudyEvents" where id = $1`, [row.event_id]);
                    promises.push(deleteEvent);
                }
                await Promise.all(promises);
            }
            await db.query(`DELETE FROM "StudyPlans" where id = $1`, [planId]);

            res.json({message: 'Навчальний план видалено'});
        } catch (e) {
            console.log(e);
            res.status(500).json('Помилка при пошуку ');
        }
    }

}

module.exports = new TeachController();
