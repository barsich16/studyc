import {TeacherActions} from "../actions/teacher";
import {teachAPI} from "../apiRequests";

export const TeacherActionCreators = {
    setMarks: payload => ({type: TeacherActions.SET_MARKS, payload}),
    setSubjects: payload => ({type: TeacherActions.SET_SUBJECTS, payload}),
    setTypes: payload => ({type: TeacherActions.SET_TYPES, payload}),
    setPlans: payload => ({type: TeacherActions.SET_PLANS, payload}),
    addPlan: payload => ({type: TeacherActions.ADD_NEW_PLAN, payload}),
    changePlan: payload => ({type: TeacherActions.CHANGE_PLAN, payload}),
    deletePlanSuccess: payload => ({type: TeacherActions.DELETE_PLAN, payload}),
    changeSubject: payload => ({type: TeacherActions.UPDATE_SUBJECT, payload}),
    changeMarks: payload => ({type: TeacherActions.CHANGE_MARKS, payload}),

    getMarks: subjectId => async dispatch => {
            const marksInfo = await teachAPI.getMarks(subjectId);
        console.log(marksInfo);
        dispatch(TeacherActionCreators.setMarks(marksInfo));
    },
    updateMarks: (changedMarks, allmarks) => async dispatch => {
            try {
                const result = await teachAPI.updateMark(changedMarks);
                dispatch(TeacherActionCreators.changeMarks({marks: allmarks, subjectId: changedMarks.subjectId}));
                return result;
            } catch (e) {
                throw e
            }
    },
    getSubjects: () => async (dispatch, getState) => {
            const userId = getState().user.userId;
            const response = await teachAPI.getSubjects(userId);
            dispatch(TeacherActionCreators.setSubjects(response.subjects));
    },
    updateSubject: (newSubjectInfo) => async dispatch => {
            try {
                const result = await teachAPI.updateSubject(newSubjectInfo);
                dispatch(TeacherActionCreators.changeSubject(newSubjectInfo));
                return result;
            } catch (e) {
                throw e
            }
    },
    getTypesEvents: () => async dispatch => {
        try {
            const types = await teachAPI.getTypesEvents();
            dispatch(TeacherActionCreators.setTypes(types));
        } catch (e) {
            throw e
        }
    },
    getPlans: () => async dispatch => {
            try {
                const result = await teachAPI.getPlans();
                dispatch(TeacherActionCreators.setPlans(result.plans));
            } catch (e) {
                throw e
            }
    },
    updatePlans: newPlansInfo => async dispatch => {
            try {
                const result = await teachAPI.updatePlans(newPlansInfo);
                newPlansInfo.events = result.newEvents;

                if (newPlansInfo.isPlanNew) {
                    newPlansInfo.id = result.id;
                    newPlansInfo.isPlanNew = false;
                    dispatch(TeacherActionCreators.addPlan(newPlansInfo));
                } else {
                    dispatch(TeacherActionCreators.changePlan(newPlansInfo));
                }

                return result;
            } catch (e) {
                throw e
            }
    },
    deletePlan: planId => async dispatch => {
            try {
                const result = await teachAPI.deletePlan(planId);
                dispatch(TeacherActionCreators.deletePlanSuccess(planId));
                return result;
            } catch (e) {
                throw e
            }
    },
}
