import { combineReducers } from "redux";
import searchText from "./searchText";
import timer from "./timer";
import songData from "./songData";

const rootReducer = combineReducers({
    searchText,
    timer,
    songData,
})

export default rootReducer;