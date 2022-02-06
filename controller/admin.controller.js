const db = require('../db');
const ApiError = require('../exceptions/api-error')

class AdminController {
    async getEmployees (req, res, next) {
        try {

            const schoolId = req.user.school;
            if (!schoolId) {
                throw ApiError.BadRequest('Не знайдено даних(')
            }
            console.log("schoolID: ", schoolId);
            // const school_id = await db.query(`SELECT id from public."Schools" where name = $1`, [schoolName]);
            const employees = await db.query(`SELECT surname, name, patronymic, role, birthdate, phone,
                (select number from "Classes" where "Classes".id = "Users".class_id) AS class_number,
                (select letter from "Classes" where "Classes".id = "Users".class_id) AS class_letter,
                (select email from "Credentials" where "Credentials".id = "Users".credentials_id) AS email,
                (select state from "Credentials" where "Credentials".id = "Users".credentials_id) AS state,
                (select verified from "Credentials" where "Credentials".id = "Users".credentials_id) AS verified
                from "Users" WHERE school_id = $1 and NOT id = 5`, [schoolId]);
            if (!employees) {
                throw ApiError.BadRequest('Не знайдено даних(')
            }
            //console.log(employees.rows);

            res.json(employees.rows);

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
