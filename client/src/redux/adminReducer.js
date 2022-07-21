import {adminAPI, teachAPI} from "./apiRequests";
import {setScheduleColumns} from "./userReducer";

const initialState = {
    employees: [],
    classes: null,
    appointment: [],
    gradeBook: [],
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
                    if (action.payload.employee_id === employee.key) {
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
            return {
                ...state,
                employees: state.employees.map(employee => {
                    if (employee.key == action.payload.teacherId) {
                        employee.class_id = action.payload.classId;
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
        case 'SET_APPOINTMENT': {
            return {
                ...state,
                appointment: [...state.appointment, action.payload]
            };
        }
        case 'CHANGE_APPOINTMENT': {
            return {
                ...state,
                appointment: state.appointment.map(appointment => {
                    if (appointment.classId === action.payload.classId) {
                        appointment.subjects = action.payload.subjects;
                    }
                    return appointment;
                })
            };
        }
        case 'SET_GRADEBOOK': {
            return {
                ...state,
                gradeBook: [...state.gradeBook, action.payload]
            };
        }
        case 'SET_CLASS_MARKS': {
            return {
                ...state,
                gradeBook: state.gradeBook.map(item => {
                    if (item.classId === action.classId && item.year === action.year) {
                        item.subjects = item.subjects.map(subject => {
                            if (subject.id === action.payload.id) {
                                return {...subject, ...action.payload}
                            }
                            return subject;
                        })
                    }
                    return item;
                })
            };
        }
        default:
            return state
    }
}

const setClasses = payload => ({type: 'SET_CLASSES', payload});
const setAppointment = payload => ({type: 'SET_APPOINTMENT', payload});
const setEmployees = payload => ({type: 'SET_EMPLOYEES', payload});
const setGradeBook = payload => ({type: 'SET_GRADEBOOK', payload});
const setClassMarks = (payload, classId, year) => ({type: 'SET_CLASS_MARKS', payload, classId, year});
const changeEmployeesStateSuccess = payload => ({type: 'ACCEPT_EMPLOYEES', payload});
const changeRoleEmployeesSuccess = payload => ({type: 'CHANGE_EMPLOYEES_ROLE', payload})
const changeEmployeesClassId = payload => ({type: 'CHANGE_EMPLOYEES_CLASS_ID', payload})
const changeAppointment = payload => ({type: 'CHANGE_APPOINTMENT', payload})


export const changeSchedule = (newSchedule) => {
    return async dispatch => {
        try {
            const res = await adminAPI.updateSchedule(newSchedule);
            dispatch(setScheduleColumns({classId: newSchedule.classId, currentSchedule: res.currentSchedule}))

            return res;
        } catch (e) {
            throw e
        }
    }
}

export const getEmployees = () => {
    return async (dispatch, getState) => {
        const token = getState().user.token;
        const response = await adminAPI.getEmployees(token);
        dispatch(setEmployees(response));
    }
}

export const createSchool = (newSchoolInfo) => {
    return async () => {
        try {
            const response = await adminAPI.createSchool(newSchoolInfo);
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
                dispatch(changeEmployeesClassId({сlassId: response.newClassId, teacherId: teacher}))
            }

            return {message: response.message};
        } catch (e) {
            throw e
        }
    }
}

export const changeState = (employee_id, newState) => {
    return async dispatch => {
        try {
            const response = await adminAPI.changeState(employee_id, newState);
            dispatch(changeEmployeesStateSuccess({employee_id, newState}));
            return response;
        } catch (e) {
            throw e
        }
    }
}
export const changeRole = (employees_id, newRole) => {
    return async dispatch => {
        try {
            const response = await adminAPI.changeEmployeeRole(employees_id, newRole);
            dispatch(changeRoleEmployeesSuccess({id: employees_id, role: newRole}));
            return response;
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

export const appointClassTeacher = (classId, teacherId) => {
    return async dispatch => {
        try {
            const response = await adminAPI.appointClassTeacher(classId, teacherId);
            dispatch(changeEmployeesClassId({classId, teacherId}));

            return response;
        } catch (e) {
            throw e
        }
    }
}

export const getAppointment = (classId) => {
    return async dispatch => {
        try {
            const response = await adminAPI.getAppointment(classId);
            dispatch(setAppointment({classId, subjects: response}));
        } catch (e) {
            throw e
        }
    }
}
export const updateAppointment = changedSubjects => {
    return async dispatch => {
        try {
            const {subjects, ...response} = await adminAPI.updateAppointment(changedSubjects);
            dispatch(changeAppointment({classId: changedSubjects.classId, subjects}));

            return response;
        } catch (e) {
            throw e
        }
    }
}

export const getAllClassSubjects = (classId, year) => {
    return async dispatch => {
        try {
            const response = await adminAPI.getAllClassSubjects(classId, year);
            dispatch(setGradeBook(response));
        } catch (e) {
            throw e
        }
    }
}
export const getClassMarks = (classId, year, subjectId) => {
    return async dispatch => {
        try {
            const response = await teachAPI.getMarks(subjectId);
            dispatch(setClassMarks(response, classId, year));
        } catch (e) {
            throw e
        }
    }
}

export const moveToNextYear = (withSubjects) => {
    return async () => {
        try {
            const response = await adminAPI.moveToNextYear(withSubjects);
        } catch (e) {
            throw e
        }
    }
}

export default adminReducer;
