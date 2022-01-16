import {teachAPI} from "./apiRequests";
import {setIsAuthenticated, setIsTokenExpired} from "./userReducer";
// const storageName = 'userData';
const initialState = {
    marks: null,
    isLoading: false,
    statusMessage: null,
    subjects: null
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
        default:
            return state
    }
}

const setMarks = payload => ({type: 'SET_MARKS', payload});
export const setStatusMessage = message => ({type: 'SET_STATUS_MESSAGE', message});
const setSubjects = payload => ({type: 'SET_SUBJECTS', payload})

export const getMarks = () => {
    return async (dispatch, getState) => {
        const token = getState().user.token;
        const marksInfo = await teachAPI.getMarks(token);
        if (marksInfo.JWTExpired) {
            dispatch(setIsTokenExpired(true));
            dispatch(setIsAuthenticated(false));
        } else {
            dispatch(setMarks(marksInfo));
        }
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
        const token = getState().user.token;
        const subjects = await teachAPI.getSubjects(token);
        if (subjects.JWTExpired) {
            dispatch(setIsTokenExpired(true));
            dispatch(setIsAuthenticated(false));
        } else {
            console.log(subjects);
            dispatch(setSubjects(subjects));
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
