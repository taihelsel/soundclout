import { UPDATE_TEXT } from "../actions/actionTypes";

const searchText = (state = "", action) => {
    switch (action.type) {
        case UPDATE_TEXT:
            return action.payload;
        default: return state;
    }
}

export default searchText;