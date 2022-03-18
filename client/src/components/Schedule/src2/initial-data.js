const initialData = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Математика', teacher: 'Teacherenko T. T.' },
        'task-2': { id: 'task-2', content: 'Українська мова', teacher: 'Teacherenko T. T.' },
        'task-3': { id: 'task-3', content: 'Зарубіжна література', teacher: 'Teacherenko T. T.' },
        'task-4': { id: 'task-4', content: 'Українська література', teacher: 'Teacherenko T. T.' },
        'task-5': { id: 'task-5', content: 'Географія', teacher: 'Teacherenko T. T.' },
        'task-6': { id: 'task-6', content: 'Алгебра', teacher: 'Teacherenko T. T.' },
        'task-7': { id: 'task-7', content: 'Історія України', teacher: 'Teacherenko T. T.' },
        'task-8': { id: 'task-8', content: 'Біологія', teacher: 'Teacherenko T. T.' },
        'task-9': { id: 'task-9', content: 'Хімія', teacher: 'Teacherenko T. T.' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Понеділок',
            taskIds: [],
        },
        'column-2': {
            id: 'column-2',
            title: 'Вівторок',
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Середа',
            taskIds: [],
        },
        'column-4': {
            id: 'column-4',
            title: 'Четвер',
            taskIds: [],
        },
        'column-5': {
            id: 'column-5',
            title: 'П\'ятниця',
            taskIds: [],
            //     title: 'Субота',
            //     taskIds: [],
            // },
        },
        'column-6': {
            id: 'column-6',
            title: 'Всі предмети',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4', 'task-5','task-6','task-7','task-8','task-9',],
        },
        // 'column-6': {
        //     id: 'column-6',
    },
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
    mainColumn: ['column-6'],
};

export default initialData;
