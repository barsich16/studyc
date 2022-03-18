import {userAPI} from "./apiRequests";
import {getEmployees} from "./adminReducer";

const storageName = 'userData';

const initialState = {
    profile: null,
    token: null,
    userId: null,
    classmates: [],
    classTeacher: null,
    isAuthenticated: false,
    loading: false,
    isTokenExpired: false,
    isLoginizationFinished: false,
    marks: null,
    role: null
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
                isAuthenticated: false
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
                classTeacher: action.classTeacher,
                classmates: action.classmates
            };
        }
        case 'SET_LOGINIZATION_FINISHED': {
            return {
                ...state,
                isLoginizationFinished: true
            };
        }
        case 'SET_PUPIL_MARKS': {
            return {
                ...state,
                marks: action.payload
            };
        }
        case 'SET_ROLE': {
            return {
                ...state,
                role: action.payload
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
const setLogout = () => ({type: 'LOGOUT'});
export const setIsTokenExpired = (payload) => ({type: 'SET_IS_TOKEN_EXPIRED', payload});
const setClass = (classmates, classTeacher) => ({type: 'SET_CLASS', classmates, classTeacher});
const setIsLoginizationFinished = () => ({type: 'SET_LOGINIZATION_FINISHED'});
const setMarks = payload => ({type: 'SET_PUPIL_MARKS', payload});
const setRole = payload => ({type: 'SET_ROLE', payload});

export const register = (values) => {
    return async dispatch => {
        try {
            const result = await userAPI.register(values);
            console.log(result);
            return result;
        } catch (e) {
            throw e;
        }
    }
}
export const partLogin = (userId, token, role) => {
    return async dispatch => {
        try {
            await dispatch(getProfile());
            await dispatch(getEmployees());
            dispatch(setToken(token));
            dispatch(setUserId(userId));
            dispatch(setIsAuthenticated(true));
            dispatch(setRole(role));
            dispatch(setLoading(false));
            dispatch(setIsLoginizationFinished(true));
            return {notShow: true}
        }
        catch (e) {
            dispatch(setIsTokenExpired(true))
            dispatch(setIsAuthenticated(false));
            dispatch(setLoading(false));
            dispatch(setIsLoginizationFinished(true));
            localStorage.removeItem(storageName);
            throw e;
        }
    }
}

export const fullLogin = formValues => {       //Thunk Creator
    return async (dispatch) => {
        // dispatch(setLoading(true));
        try {
            const dataLogin = await userAPI.login(formValues);
            const {userId, token, role} = dataLogin;
            localStorage.setItem(storageName, JSON.stringify({
                userId, token, role
            }));
            dispatch(partLogin(userId, token, role));
            return {message: 'Вхід виконано'}
        } catch (e) {
            // return {message: e.message};
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
            console.log(result);
            return result;
        } catch (e) {
            throw e;
        }
    }
}
export const getClass = () => {
    return async (dispatch, getState) => {
        try {
            const token = getState().user.token;
            const classId = getState().user.profile.classID;
            const {classmates, classTeacher} = await userAPI.getClass(token, classId);
            dispatch(setClass(classmates, classTeacher));
        } catch(e) {
            dispatch(logout());
            //dispatch(setIsAuthenticated(false));
            throw e


        }
        // if (classInfo.JWTExpired) {
        //     dispatch(setIsTokenExpired(true));
        //     dispatch(setIsAuthenticated(false));
        // } else if (classInfo.resultCode === 0) {
        //     dispatch(setClass(classInfo.classmates, classInfo.classTeacher));
        // }
    }
}
export const getMarks = () => {
    return async (dispatch, getState) => {
        const userId = getState().user.userId;
        const marksInfo = await userAPI.getMarks(userId);
        dispatch(setMarks(marksInfo));

    }
}
export const logout = () => {
    return async dispatch => {
        dispatch(setLogout());
        localStorage.removeItem(storageName);
    }
}

export default userReducer;
