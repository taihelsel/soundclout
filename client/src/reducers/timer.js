import { INIT_TIMER, DEC_TIMER } from "../actions/actionTypes";

const timer = (state = {}, action) => {
    switch (action.type) {
        case INIT_TIMER: {
            const newState = { ...state };
            newState.timeLeft = action.payload;
            return newState;
        }
        case DEC_TIMER: {
            const newState = { ...state };
            newState.timeLeft -= action.payload;
            return newState;
        }
        default: return state;
    }
}

export default timer;