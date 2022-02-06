import {adminAPI} from "./apiRequests";

const initialState = {
    employees: [],
}
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_EMPLOYEES': {
            return {
                ...state,
                employees: action.payload
            };
        }
        default:
            return state
    }
}

const setMarks = payload => ({type: 'SET_MARKS', payload});
const setEmployees = payload => ({type: 'SET_EMPLOYEES', payload});

export const getEmployees = () => {
    return async (dispatch, getState) => {
        const token = getState().user.token;
        //const schoolName = getState().user.profile.school;
        //console.log(schoolName);
        const response = await adminAPI.getEmployees(token);
        console.log(response);

        dispatch(setEmployees(response));
        // dispatch(setTypes(response.types));

    }
}

export const createSchool = (newSchoolInfo) => {
    return async dispatch => {
        try {
            const response = await adminAPI.createSchool(newSchoolInfo);
            console.log(response);
            return response;
        } catch (e) {
            throw e
        }
    }
}

export default adminReducer;
