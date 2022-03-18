import {
    ADD_NEW_PLAN,
    CHANGE_PLAN,
    DELETE_PLAN,
    SET_MARKS,
    SET_PLANS,
    SET_SUBJECTS,
    SET_TYPES, UPDATE_SUBJECT
} from "../actions/teacher";

export const setMarks = payload => ({type: SET_MARKS, payload});
export const setSubjects = payload => ({type: SET_SUBJECTS, payload});
export const setTypes = payload => ({type: SET_TYPES, payload});
export const setPlans = payload => ({type: SET_PLANS, payload});
export const addPlan = payload => ({type: ADD_NEW_PLAN, payload});
export const changePlan = payload => ({type: CHANGE_PLAN, payload});
export const deletePlanSuccess = payload => ({type: DELETE_PLAN, payload});
export const changeSubject = payload => ({type: UPDATE_SUBJECT, payload});
