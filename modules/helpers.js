const db = require('../db/db');

module.exports = {
    findLessonSchedule: async (classId) => {
        const {rows: weekDays} = await db.query(`select * from "Weekday"`);
        const {rows: schedule} = await db.query(`select * from "Schedules" where class_id = $1 order by weekday_id, number_lesson`, [classId]);

        const currentSchedule = {};
        weekDays.forEach(weekday => {
            currentSchedule[weekday.id] = schedule.filter(item => item.weekday_id === weekday.id).map(item => item.subject_id);
        })

        return {weekDays, currentSchedule};
    },
    findUserLessonSchedule: async (role, userId) => {

        const {rows: weekDays} = await db.query(`select * from "Weekday"`);
        const query = role === 'pupil'
            ? `select * from "Schedules" where class_id = (select class_id from "Users" where id = $1) order by weekday_id, number_lesson`
            : `select * from "Schedules" where subject_id in (select id from "Subjects" where teacher_id = $1) order by weekday_id, number_lesson`;

        const {rows: schedule} = await db.query(query, [userId]);

        const currentSchedule = {};
        if (role === 'pupil') {
            weekDays.forEach(weekday => {
                currentSchedule[weekday.id] = schedule.filter(item => item.weekday_id === weekday.id).map(item => item.subject_id);
            })
        } else {
            weekDays.forEach(weekday => {
                const filtered = schedule.filter(item => item.weekday_id === weekday.id);
                // const higherLesson = filtered.reduce((acc, curr) => acc > curr.number_lesson ? acc : curr.number_lesson, 0);
                if (filtered.length > 0) {
                    const higherLesson = filtered[filtered.length-1].number_lesson;
                    for (let i = 0; i < higherLesson; i++) {
                        if (filtered[i].number_lesson !== i+1) {
                            filtered.splice(i, 0, null);
                        }
                    }
                }
                currentSchedule[weekday.id] = filtered.map(item => {
                    if (item) {
                        return item.subject_id;
                    }
                    return item;
                });
            })
        }

        return {weekDays, currentSchedule};
    }
};
