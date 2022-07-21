import Board from "./index";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {changeSchedule} from "../../../redux/adminReducer";
import Loader from "../../Loader";
import {useFetching} from "../../../hooks/useFetchingDispatch.hook";
import {getSchedule} from "../../../redux/userReducer";

export const BoardContainer = ({classId}) => {
    const dispatch = useDispatch();
    const {fetching} = useFetching();
    const initialClassData = useSelector(state => state.user.schedule.find(item => item.classId === classId));
    const weekdays = useSelector(state => state.user.weekdays);

    useEffect(() => {
        if (!initialClassData) {
            console.log(classId);
            dispatch(getSchedule(classId));
        }
    });

    if (!initialClassData || !weekdays) {
        return <Loader />;
    }

    const findChangedLesson = (mainColumns, comparedColumns, resultArray) => {
        Object.keys(mainColumns).forEach((item) => {
            mainColumns[item].subjectIds.forEach((subjectId, index) => {
                if (comparedColumns[item].subjectIds[index] !== subjectId) {
                    resultArray.push({subjectId, number_lesson: index+1, weekday_id: item })
                }
            })
        });
    }

    const tasks = {};
    initialClassData.subjects.forEach(item => {
        tasks[item.id] = {id: item.id+'', subjectId: item.id+'', content: item.name, teacher: item.teacher_name, cabinet: item.cabinet}
    })
    tasks['empty-item'] = { id: 'empty-item', subjectId: null, content: '', teacher: '', window: true, cabinet: '' };

    const columns = {};
    columns['column-6'] = {id: 'column-6', title: 'Всі предмети', taskIds: [...Object.keys(tasks)], subjectIds: Object.keys(tasks).map(task => tasks[task].subjectId)};
    weekdays.forEach(item => {
        const newTaskIds = initialClassData.currentSchedule[item.id].map((subjectsId, index) => {
            const changedId = subjectsId + item.day + index; //генеруємо унікальний id для елементів вже існуючого розкладу
            const existingSubject = subjectsId
                ? tasks[subjectsId]
                : { id: 'empty-item', subjectId: null, content: '', teacher: '', window: true, cabinet: '' };
            tasks[changedId] = { ...existingSubject, id: changedId };
            return changedId;
        })
        columns[item.id] = {id: item.id+'', title: item.day, taskIds: [...newTaskIds], subjectIds: [...initialClassData.currentSchedule[item.id]]};
    })

    const updateSchedule = (newColumns) => {
        const deletedItems = [], insertedItems = [];

        findChangedLesson(columns, newColumns, deletedItems);
        findChangedLesson(newColumns, columns, insertedItems);

        fetching(changeSchedule, {deletedItems, insertedItems, classId});
    }

    const columnOrder = [1, 2, 3, 4, 5];   //TODO: взяти номери з weekdays.id
    const mainColumn= ['column-6'];
    const initialData = {tasks, columns, columnOrder, mainColumn};

    return (
        <Board initialData={initialData} updateSchedule={updateSchedule} />
    );
}
