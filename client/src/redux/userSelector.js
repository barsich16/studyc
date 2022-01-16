//import {createSelector} from "reselect";

export const getIsAuthenticatedSelector = state => {
    return state.user.isAuthenticated;
}
export const getTokenSelector = state => {
    return state.user.token;
}
export const getIsTokenExpiredSelector = state => {
    return state.user.isTokenExpired;
}

export const getProfileSelector = state => {
    return state.user.profile;
}
export const getClassTeacherSelector = state => {
    return state.user.classTeacher;
}
export const getClassmatesSelector = state => {
    return state.user.classmates;
}

