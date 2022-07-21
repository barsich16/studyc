import { TeacherActions } from "./actions/teacher";
const initialState = {
    marks: [],
    isLoading: false,
    statusMessage: null,
    subjects: null,
    typesEvents: null,
    studyPlans: null,
}
const teacherReducer = (state = initialState, action) => {
    switch (action.type) {
        case TeacherActions.SET_MARKS: {
            return {
                ...state,
                marks: [...state.marks, action.payload]
            };
        }
        case TeacherActions.CHANGE_MARKS: {
            return {
                ...state,
                marks: state.marks.map(item => {
                    if (item.id === action.payload.subjectId) {
                        return {...item, pupilsMarks: action.payload.marks}
                    }
                    return item;
                })
            };
        }
        case TeacherActions.LOADING: {
            return {
                ...state,
                isLoading: action.loading
            };
        }
        case TeacherActions.SET_STATUS_MESSAGE: {
            return {
                ...state,
                statusMessage: action.message
            };
        }
        case TeacherActions.SET_SUBJECTS: {
            return {
                ...state,
                subjects: action.payload
            };
        }
        case TeacherActions.SET_TYPES: {
            return {
                ...state,
                typesEvents: action.payload
            };
        }
        case TeacherActions.SET_PLANS: {
            return {
                ...state,
                studyPlans: action.payload
            };
        }
        case TeacherActions.ADD_NEW_PLAN: {
            return {
                ...state,
                studyPlans: [...state.studyPlans, action.payload]
            };
        }
        case TeacherActions.CHANGE_PLAN: {
            return {
                ...state,
                studyPlans: state.studyPlans.map(plan => {
                    if (plan.id === action.payload.id) {
                        return action.payload
                    }
                    return plan;
                })
            };
        }
        case TeacherActions.DELETE_PLAN: {
            return {
                ...state,
                studyPlans: state.studyPlans.filter(plan => plan.id !== action.payload)
            };
        }
        case TeacherActions.UPDATE_SUBJECT: {
            const {id, link, other, other_materials, study_plan} = action.payload;

            return {
                ...state,
                subjects: state.subjects.map(subject => {
                    if (subject.id === id) {
                        return {...subject, link, other, other_materials, study_plan_id: study_plan};
                    }
                    return subject;
                })
            };
        }
        default:
            return state
    }
}
export default teacherReducer;
