import {teachAPI} from "./apiRequests";
import {setIsAuthenticated, setIsTokenExpired} from "./userReducer";
// const storageName = 'userData';
const initialState = {
    marks: null,
    isLoading: false,
    statusMessage: null,
    subjects: null,
    typesEvents: []
}
const teacherReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MARKS': {
            return {
                ...state,
                marks: action.payload
            };
        }
        case 'LOADING': {
            return {
                ...state,
                isLoading: action.loading
            };
        }
        case 'SET_STATUS_MESSAGE': {
            return {
                ...state,
                statusMessage: action.message
            };
        }
        case 'SET_SUBJECTS': {
            return {
                ...state,
                subjects: action.payload
            };
        }
        case 'SET_TYPES': {
            return {
                ...state,
                typesEvents: action.payload
            };
        }
        default:
            return state
    }
}

const setMarks = payload => ({type: 'SET_MARKS', payload});
export const setStatusMessage = message => ({type: 'SET_STATUS_MESSAGE', message});
const setSubjects = payload => ({type: 'SET_SUBJECTS', payload});
const setTypes = payload => ({type: 'SET_TYPES', payload});

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
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const result = await teachAPI.updateSubject(token, newSubjectInfo);
            console.log(result);
            return result;
        } catch (e) {
            throw e
        }
    }
}

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
