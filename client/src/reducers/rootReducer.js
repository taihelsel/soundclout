import { combineReducers } from "redux";
import searchText from "./searchText";
import timer from "./timer";

const rootReducer = combineReducers({
    searchText,
    timer,
})

export default rootReducer;