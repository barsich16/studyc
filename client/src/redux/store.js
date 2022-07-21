import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import teacherReducer from "./teacherReducer";
import adminReducer from "./adminReducer";

const appReducer = combineReducers({
    user: userReducer,
    teacher: teacherReducer,
    admin: adminReducer,
});
const rootReducer = (state, action) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined
    }

    return appReducer(state, action)
}
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
