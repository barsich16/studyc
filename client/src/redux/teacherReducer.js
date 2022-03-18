import {teachAPI} from "./apiRequests";
import {
    ADD_NEW_PLAN, CHANGE_PLAN, DELETE_PLAN,
    LOADING,
    SET_MARKS,
    SET_PLANS,
    SET_STATUS_MESSAGE,
    SET_SUBJECTS,
    SET_TYPES, UPDATE_SUBJECT
} from "./actions/teacher";
import {
    addPlan,
    changePlan,
    changeSubject,
    deletePlanSuccess,
    setMarks,
    setPlans,
    setSubjects,
    setTypes
} from "./actionCreators/teacher";
// const storageName = 'userData';
const initialState = {
    marks: null,
    isLoading: false,
    statusMessage: null,
    subjects: null,
    typesEvents: [],
    // studyPlans: []
}
const teacherReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MARKS: {
            return {
                ...state,
                marks: action.payload
            };
        }
        case LOADING: {
            return {
                ...state,
                isLoading: action.loading
            };
        }
        case SET_STATUS_MESSAGE: {
            return {
                ...state,
                statusMessage: action.message
            };
        }
        case SET_SUBJECTS: {
            return {
                ...state,
                subjects: action.payload
            };
        }
        case SET_TYPES: {
            return {
                ...state,
                typesEvents: action.payload
            };
        }
        case SET_PLANS: {
            return {
                ...state,
                studyPlans: action.payload
            };
        }
        case ADD_NEW_PLAN: {
            return {
                ...state,
                studyPlans: [...state.studyPlans, action.payload]
            };
        }
        case CHANGE_PLAN: {
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
        case DELETE_PLAN: {
            return {
                ...state,
                studyPlans: state.studyPlans.filter(plan => plan.id !== action.payload)
            };
        }
        case UPDATE_SUBJECT: {
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

export const getMarks = () => {
    return async (dispatch, getState) => {
        const userId = getState().user.userId;
        const marksInfo = await teachAPI.getMarks(userId);
        dispatch(setMarks(marksInfo));
    }
}
export const updateMarks = (subjectName, newMarks) => {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const result = await teachAPI.updateMark(token, subjectName, newMarks);
            return result;
        } catch (e) {
            throw e
        }
    }
}

export const getSubjects = () => {
    return async (dispatch, getState) => {
        const userId = getState().user.userId;
        const response = await teachAPI.getSubjects(userId);
        dispatch(setSubjects(response.subjects));
        dispatch(setTypes(response.types));

    }
}
export const updateSubject = (newSubjectInfo) => {
    return async dispatch => {
        try {
            const result = await teachAPI.updateSubject(newSubjectInfo);
            dispatch(changeSubject(newSubjectInfo));
            return result;
        } catch (e) {
            throw e
        }
    }
}

export const getPlans = () => {
    return async dispatch => {
        try {
            const result = await teachAPI.getPlans();
            dispatch(setPlans(result.plans));
        } catch (e) {
            throw e
        }
    }
}
export const updatePlans = (newPlansInfo) => {
    return async dispatch => {
        try {
            const result = await teachAPI.updatePlans(newPlansInfo);
            if (newPlansInfo.isPlanNew) {
                newPlansInfo.id = result.id;
                dispatch(addPlan(newPlansInfo));
            } else {
                dispatch(changePlan(newPlansInfo));
            }
            return result;
        } catch (e) {
            throw e
        }
    }
}
export const deletePlan = (planId) => {
    return async dispatch => {
        try {
            const result = await teachAPI.deletePlan(planId);
            dispatch(deletePlanSuccess(planId));
            return result;
        } catch (e) {
            throw e
        }
    }
}
//TODO: на каналі ulbiTV глянуть проект підписниці

// export const updateMarks = (subjectName, newMarks) => {
//     console.log("тута");
//     return async (dispatch, getState) => {
//         console.log("IN Reducer");
//         dispatch(setLoading(true));
//         const token = getState().user.token;
//         const marksInfo = await teachAPI.getMarks(token);
//         //const update = await teachAPI.updateMark(token, subjectName, newMarks);
//         dispatch(setLoading(false));
//         console.log(marksInfo);
//     }
// }
export default teacherReducer;
