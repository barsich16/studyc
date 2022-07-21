import {userAPI} from "./apiRequests";
import {getEmployees} from "./adminReducer";

const storageName = 'userData';

const initialState = {
    profile: null,
    token: null,
    userId: null,
    classPupils: null,
    classTeacher: null,
    isAuthenticated: false,
    loading: false,
    isTokenExpired: false,
    isLoginizationFinished: false,
    marks: [],
    role: null,
    schedule: [],
    weekdays: null
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INITIALIZE-USER': {
            return {
                ...state,
                profile: action.profile
            };
        }
        case 'LOADING': {
            return {
                ...state,
                loading: action.loading
            };
        }
        case 'SET-TOKEN': {
            return {
                ...state,
                token: action.token,
                isTokenExpired: false
            };
        }
        case 'SET-USERID': {
            return {
                ...state,
                userId: action.userId
            };
        }
        case 'SET-IS-AUTHENTICATED': {
            return {
                ...state,
                isAuthenticated: action.payload
            };
        }
        case 'LOGOUT': {
            return {
                ...state,
                profile: null,
                token: null,
                userId: null,
                isAuthenticated: false,
                isLoginizationFinished: true
            };
        }
        case 'SET_IS_TOKEN_EXPIRED': {
            return {
                ...state,
                isTokenExpired: true
            };
        }
        case 'SET_CLASS': {
            return {
                ...state,
                ...action.payload
            };
        }
        case 'SET_LOGINIZATION_FINISHED': {
            return {
                ...state,
                isLoginizationFinished: true
            };
        }
        case 'SET_ALL_PUPIL_MARKS': {
            return {
                ...state,
                marks: [...state.marks, action.payload],
            };
        }
        case 'SET_PUPIL_MARKS': {
            return {
                ...state,
                marks: state.marks.map(item => {
                    if (item.pupilId === action.pupilId) {
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
        case 'SET_ROLE': {
            return {
                ...state,
                role: action.payload
            };
        }
        case 'SET_SCHEDULE': {
            return {
                ...state,
                schedule: [...state.schedule, action.payload],
            };
        }
        case 'SET_WEEKDAYS': {
            return {
                ...state,
                weekdays: action.payload,
            };
        }
        case 'SET_SCHEDULE_COLUMNS': {
            return {
                ...state,
                schedule: state.schedule.map(item => {
                    if (item.classId === action.payload.classId) {
                        item.currentSchedule = action.payload.currentSchedule;
                    }
                    return item;
                }),
            };
        }
        default:
            return state
    }
}

const setProfile = profile => ({type: 'INITIALIZE-USER', profile});
const setLoading = loading => ({type: 'LOADING', loading});
const setToken = token => ({type: 'SET-TOKEN', token});
const setUserId = userId => ({type: 'SET-USERID', userId});
export const setIsAuthenticated = payload => ({type: 'SET-IS-AUTHENTICATED', payload});
const setLogout = () => ({type: 'USER_LOGOUT'});
export const setIsTokenExpired = (payload) => ({type: 'SET_IS_TOKEN_EXPIRED', payload});
const setClass = payload => ({type: 'SET_CLASS', payload});
const setIsLoginizationFinished = () => ({type: 'SET_LOGINIZATION_FINISHED'});
const setAllMarks = payload => ({type: 'SET_ALL_PUPIL_MARKS', payload});
const setMarks = (payload, pupilId) => ({type: 'SET_PUPIL_MARKS', payload, pupilId});
const setRole = payload => ({type: 'SET_ROLE', payload});
export const setScheduleColumns = payload => ({type: 'SET_SCHEDULE_COLUMNS', payload});

export const register = (values) => {
    return async () => {
        try {
            const result = await userAPI.register(values);
            return result;
        } catch (e) {
            throw e;
        }
    }
}

export const partLogin = (userId, token, role) => {
    return async dispatch => {
        try {
            dispatch(setLoading(true));
            await dispatch(getProfile());
            await dispatch(getEmployees());
            dispatch(setToken(token));
            dispatch(setUserId(userId));
            dispatch(setIsAuthenticated(true));
            dispatch(setRole(role));
            dispatch(setLoading(false));

            return {notShow: true}
        }
        catch (e) {
            dispatch(setIsTokenExpired(true))
            dispatch(setIsAuthenticated(false));
            dispatch(setLoading(false));

            localStorage.removeItem(storageName);
            throw e;
        }
    }
}
export const fullLogin = formValues => {       //Thunk Creator
    return async (dispatch) => {

        try {
            const dataLogin = await userAPI.login(formValues);
            const {userId, token, role} = dataLogin;
            localStorage.setItem(storageName, JSON.stringify({
                userId, token, role
            }));
            dispatch(partLogin(userId, token, role));

            return {message: 'Вхід виконано'}
        } catch (e) {
            throw e;
        }
    };
}

export const getProfile = () => {
    return async dispatch => {
        try {
            const profile = await userAPI.getProfile();
            dispatch(setProfile(profile));
        } catch (e) {
            throw e
        }
    }
}
export const updateProfile = (newProfileInfo) => {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const result = await userAPI.updateProfileInfo(token, newProfileInfo);

            return result;
        } catch (e) {
            throw e;
        }
    }
}

export const getClass = () => {
    return async dispatch => {
        try {

            const response = await userAPI.getClass();
            if (!response.isNotClassTeacher) {
                dispatch(setClass(response))
            }
        } catch(e) {
            throw e
        }
    }
}

export const getAllMarks = (pupilId) => {
    return async dispatch => {
        const marksInfo = await userAPI.getAllMarks(pupilId);
        dispatch(setAllMarks(marksInfo));
    }
}

export const getMarks = (pupilId, subjectId) => {
    return async dispatch => {
        const marksInfo = await userAPI.getMarks(pupilId, subjectId);
        dispatch(setMarks(marksInfo, pupilId));
    }
}

const setSchedule = payload => ({type: 'SET_SCHEDULE', payload});
const setWeekdays = payload => ({type: 'SET_WEEKDAYS', payload});
export const getSchedule = (classId) => {
    return async (dispatch, getState) => {
        try {
            if (!classId) {
                classId = getState().user.profile.class_id;
            }

            const {weekDays, subjects, currentSchedule} = await userAPI.getSchedule(classId);
            dispatch(setSchedule({classId, subjects, currentSchedule}));
            dispatch(setWeekdays(weekDays));
        } catch (e) {
            throw e
        }
    }
}
export const getMySchedule = () => {
    return async dispatch => {
        try {
            const {userId, weekDays, subjects, currentSchedule} = await userAPI.getMySchedule();
            dispatch(setSchedule({userId, subjects, currentSchedule}));
            dispatch(setWeekdays(weekDays));
        } catch (e) {
            throw e
        }
    }
}

export const logout = () => {
    return async dispatch => {
        dispatch(setLogout());
        localStorage.removeItem(storageName);
    }
}

export default userReducer;
