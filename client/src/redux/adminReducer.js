import {adminAPI} from "./apiRequests";

const initialState = {
    employees: [],
    classes: [],
}
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_EMPLOYEES': {
            return {
                ...state,
                employees: action.payload
            };
        }
        case 'ACCEPT_EMPLOYEES': {
            return {
                ...state,
                employees: state.employees.map(employee => {
                    if (action.payload.employees_id.includes(employee.key)) {
                        employee.state = action.payload.newState;
                    }
                    return employee;
                })
            };
        }
        case 'CHANGE_EMPLOYEES_ROLE': {
            return {
                ...state,
                employees: state.employees.map(employee => {
                    if (employee.key === action.payload.id) {
                        employee.role = action.payload.role;
                    }
                    return employee;
                })
            };
        }
        case 'CHANGE_EMPLOYEES_CLASS_ID': {
            console.log(action.payload);
            return {
                ...state,
                employees: state.employees.map(employee => {
                    if (employee.key == action.payload.teacher) {
                        employee.class_id = action.payload.newClassId;
                    }
                    return employee;
                })
            };
        }
        case 'SET_CLASSES': {
            return {
                ...state,
                classes: action.payload
            };
        }
        default:
            return state
    }
}

// const setMarks = payload => ({type: 'SET_MARKS', payload});
const setClasses = payload => ({type: 'SET_CLASSES', payload});
const setEmployees = payload => ({type: 'SET_EMPLOYEES', payload});
const changeEmployeesStateSuccess = payload => ({type: 'ACCEPT_EMPLOYEES', payload});
const changeRoleEmployeesSuccess = payload => ({type: 'CHANGE_EMPLOYEES_ROLE', payload})
const changeEmployeesClassId = payload => ({type: 'CHANGE_EMPLOYEES_CLASS_ID', payload})


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
export const createClass = (number, letter = null, teacher = null) => {
    return async dispatch => {
        try {
            const response = await adminAPI.createClass({number, letter, teacher});
            console.log(response);
            dispatch(setClasses(response.classes));
            if (teacher) {
                dispatch(changeEmployeesClassId({newClassId: response.newClassId, teacher}))
            }

            return {message: response.message};
        } catch (e) {
            throw e
        }
    }
}
export const changeState = (employees_id, newState) => {
    return async dispatch => {
        try {
            await adminAPI.changeState(employees_id, newState);
            dispatch(changeEmployeesStateSuccess({employees_id, newState}));
            console.log(employees_id);
        } catch (e) {
            throw e
        }
    }
}
export const changeRole = (employees_id, newRole) => {
    return async dispatch => {
        try {
            await adminAPI.changeEmployeeRole(employees_id, newRole);
            dispatch(changeRoleEmployeesSuccess({id: employees_id, role: newRole}));
        } catch (e) {
            console.log(e);
        }
    }
}
export const getClasses = () => {
    return async dispatch => {
        try {
            const response = await adminAPI.getClasses();
            console.log(response);

            dispatch(setClasses(response));
        } catch (e) {
            throw e
        }
    }
}


export default adminReducer;
