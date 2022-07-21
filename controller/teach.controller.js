const db = require('../db/db');
const query = require('../db/queries');
const ApiError = require('../exceptions/api-error');

const changeMarksMaker = (subjectId, promises) => {
    return (newMarks, query) => {
        try {
            for (const newMark of newMarks) {
                const eventsId = Object.keys(newMark.marks);
                for (const eventId of eventsId) {
                    let result = db.query(query, [newMark.pupil_id, subjectId, +eventId, +newMark.marks[eventId]]);
                    promises.push(result);
                }
            }
        } catch (e) {
            throw ApiError.DataBaseError();
        }
    }
}
const findEventsByPlans = async planId => {
    try {
        const events = await db.query(
            `select id, name, short_name, order_number, notes, study_plan_id, semester, (select id as id_type_event from "TypesEvents" where "TypesEvents".id = "StudyEvents".types_events_id)
                        from "StudyEvents" where study_plan_id = $1 and order_number is not NULL ORDER BY order_number`, [planId]
        );
        return events.rows;
    } catch (e) {
        throw e;
    }
}

class TeachController {
    async getMarks(req, res) {
        try {
            const subjectId = +req.params.id;
            const allMarks = await db.query(`select mark, pupil_id, event_id from "Marks" where subject_id = $1`, [subjectId]);
            const pupils = await db.query(`select surname || ' ' || name || ' ' || patronymic as pupil_name, id as key from "Users" 
                where class_id = (select class_id from "Subjects" where id = $1) and role = 'pupil'`, [subjectId])
            const allEventsFromStudyPlan = await db.query(`select id, name, short_name, order_number, semester, 
                (select required_type from "TypesEvents" where id = "StudyEvents".types_events_id) 
                from "StudyEvents" where study_plan_id =
                (select plan_id from "Subjects" where id = $1) order by required_type, order_number`, [subjectId]);

            const pupilsMarks = pupils.rows.map(pupil => {
                const pupilsMarks = allMarks.rows.filter(record => record.pupil_id === pupil.key);
                const obj = {};
                pupilsMarks.forEach(record => {
                    obj[record.event_id] = record.mark;
                });
                return {...pupil, ...obj};
            });
            const response = {id: subjectId, events: allEventsFromStudyPlan.rows, pupilsMarks};

            res.json(response);
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async updateMarks(req, res, next) {
        try {
            const {deletedMarks, addedMarks, updatedMarks, subjectId} = req.body;
            const promises = [];
            const changeMarks = changeMarksMaker(subjectId, promises);

            if (deletedMarks.length > 0) {
                changeMarks(deletedMarks, query.deleteMark);
            }
            if (addedMarks.length > 0) {
                changeMarks(addedMarks, query.addMark);
            }
            if (updatedMarks.length > 0) {
                changeMarks(updatedMarks, query.updateMark);
            }

            await Promise.all(promises);

            res.json({resultCode: 0, message: 'Зміни збережено'});
        } catch (e) {
            next(e);
        }
    }

    async testGetSubjectsInfo(req, res) {
        try {
            const userId = +req.params.id;

            const {rows} = await db.query(
                `select Sub.name, Sub.other, Sub.other_materials, Sub.id, Sub.link, Clas.id as class_id, Clas.number as class_number, Clas.letter as class_letter, 
                Stud.id as study_plan_id, Stud.name as study_plan_name from "Subjects" as Sub 
                LEFT JOIN "StudyPlans" as Stud ON Sub.plan_id = Stud.id 
                LEFT JOIN "Classes" as Clas ON Sub.class_id = Clas.id where Sub.teacher_id = $1`, [userId]
            );

            res.json({subjects: rows});
        } catch (e) {
            res.status(500).json('Помилка при пошуку');
        }
    }

    async testUpdateSubjectInfo(req, res, next) {
        try {
            const newSubjectInfo = req.body;

            await db.query(
                `Update "Subjects" set other_materials = $1, link = $2, other = $3, plan_id = $4 where id = $5`,
                [newSubjectInfo.other_materials, newSubjectInfo.link, newSubjectInfo.other, +newSubjectInfo.study_plan, +newSubjectInfo.id]
            );

            res.json({message: 'Дані оновлено'});
        } catch (e) {
            res.status(500).json('Помилка при пошуку ');
        }
    }

    async getTypesEvents(req, res, next) {
        try {
            const {rows: typesEvents} = await db.query(`select * from "TypesEvents" where required_type is NULL`);
            res.json(typesEvents);
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async getPlans(req, res, next) {
        try {
            const userId = req.user.userId;
            const {rows} = await db.query(`select * from "StudyPlans" where teacher_id = $1`, [userId])

            for (const plan of rows) {
                plan.events = await findEventsByPlans(plan.id);
            }
            res.json({plans: rows});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }

    async updatePlans(req, res, next) {
        try {
            let {
                name, class_number, events = null, isPlanNew = false,
                id, year, cabinet = null
            } = req.body;
            const promises = [];

            if (isPlanNew) {
                const newStudyPlan = await db.query(
                    `INSERT INTO "StudyPlans" (name, teacher_id, class_number, year, cabinet)
                    VALUES ($1, $2, $3, $4, $5) Returning id`,
                    [name, req.user.userId, class_number, year, cabinet]
                );
                id = newStudyPlan.rows[0].id;

                const {rows: specialEvents} = await db.query(  //шукаємо айдішніки для семестрових та річної
                    `select * from "TypesEvents" where required_type IS NOT NULL order by required_type`
                );
                for (const specialEvent of specialEvents) {
                    const addEvent = db.query(`
                            INSERT INTO "StudyEvents" (name, types_events_id, study_plan_id)
                            VALUES ($1, $2, $3) RETURNING id`,
                        [specialEvent.type, specialEvent.id, id]);
                    promises.push(addEvent);
                }
            }

            if (events) {
                const {addedEvents = [], deletedEvents = [], updatedEvents = []} = events;
                if (deletedEvents.length > 0) {
                    for (const deletedEvent of deletedEvents) {
                        const deleteEvent = db.query(`
                            DELETE FROM "StudyEvents" where id = $1`,
                            [deletedEvent]
                        );
                        promises.push(deleteEvent);
                    }
                }
                if (addedEvents.length > 0) {
                    for (const addedEvent of addedEvents) {
                        const addEvent = db.query(`
                            INSERT INTO "StudyEvents" (name, short_name, types_events_id, order_number, notes, study_plan_id, semester)
                            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
                            [addedEvent.name, addedEvent.short_name, addedEvent.id_type_event, addedEvent.order_number, addedEvent.notes, id, addedEvent.semester]);
                        promises.push(addEvent);
                    }
                }
                if (updatedEvents.length > 0) {
                    for (const updatedEvent of updatedEvents) {
                        const updateEvent = db.query(`
                            UPDATE "StudyEvents" SET name = $1, short_name = $2, types_events_id = $3, order_number = $4, notes = $5, semester = $6 where id = $7`,
                            [updatedEvent.name, updatedEvent.short_name, updatedEvent.id_type_event, updatedEvent.order_number, updatedEvent.notes, updatedEvent.semester, updatedEvent.id]
                        );
                        promises.push(updateEvent);
                    }
                }
            }
            const updatePlan = db.query(
                `Update "StudyPlans" set class_number = $1, cabinet = $2 where id = $3`,
                [class_number, cabinet, id]
            )

            promises.push(updatePlan)
            await Promise.all(promises);
            const newEvents = await findEventsByPlans(id);

            res.json({message: 'Дані оновлено', id, newEvents});
        } catch (e) {
            res.status(500).json('Помилка при пошуку ');
        }
    }

    async deletePlan(req, res, next) {
        try {
            await db.query(`DELETE FROM "StudyPlans" where id = $1`, [req.body.planId]);
            res.json({message: 'Навчальний план видалено'});
        } catch (e) {
            res.status(500).json('Помилка при видаленні навчального плану');
        }
    }
}

module.exports = new TeachController();
