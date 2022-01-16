import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import teacherReducer from "./teacherReducer";

const rootReducer = combineReducers({
    user: userReducer,
    teacher: teacherReducer,
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
window.store = store;
export default store;
