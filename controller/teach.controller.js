const testDataUser = require('../data').users;
const testDataSubjects = require('../data').subjects;
const testMarks = require('../data').globalMarks;
const testClass = require('../data').class;
const testStudyPlans = require('../data').studyPlans;
const testDataPlansEvents = require('../data').plansEvents;
const testDataStudyEvents = require('../data').studyEvents;


class TeachController {
    async testGetMarksInfo (req, res) {
        try {
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
    async testUpdateMarksInfo (req, res) {
        try {
            const {subjectName, newMarks} = req.body;
            const marksItem = Object.keys(testMarks).find(item => {
                return item === subjectName
            });
            if (!marksItem) {
                return res.status(400).json({ message: 'Не знайдено предмету', resultCode: 1})
            }

            testMarks[marksItem] = newMarks;
            res.json({resultCode: 0, message: 'Зміни збережено'});
        } catch (e) {
            res.status(500).json('Помилка при пошуку оцінок');
        }
    }
    async testGetSubjectsInfo (req, res) {
        try {
            // const subjectsArray = [];
            // Object.assign(subjectsArray, testDataSubjects);
            //console.log("here", subjectsArray);
            //{id: 1, name: 'Математика', teacherId: 2, classId: 2, studyPlan: 1},
            const subjects = testDataSubjects.filter(item => {
                return item.teacherId == req.user.userId
            });
            const result = subjects.map(item => {
                const eventIdArray = testDataPlansEvents.filter(planEvent => {
                    return planEvent.planId == item.studyPlan
                });
                console.log("eventID:", eventIdArray);
                return {
                    id: item.id,
                    name: item.name,
                    link: item.link,
                    class: testClass.find(classes => classes.id == item.classId),
                    studyPlan: testStudyPlans.find(plans => plans.id == item.studyPlan),
                    events:  eventIdArray.map(event => {
                        return testDataStudyEvents.find(ev => ev.id == event.eventId);
                    }),
                };
            })
            res.json(result);

        } catch (e) {
            res.status(500).json('Помилка при пошуку');
        }
    }


}
module.exports = new TeachController();
