import { FETCH_SONGDATA_BEGIN, FETCH_SONGDATA_SUCCESS, FETCH_SONGDATA_FAILURE } from "../actions/actionTypes";

const initState = {
    loading: false,
    error: null,
    fetchedData: {},
}
const songData = (state = initState, action) => {
    switch (action.type) {
        case FETCH_SONGDATA_BEGIN: {
            return {
                ...state,
                loading: true,
                error: null,
            }
        }
        case FETCH_SONGDATA_SUCCESS: {
            return {
                ...state,
                loading: false,
                fetchedData: action.payload,
            }
        }
        case FETCH_SONGDATA_FAILURE: {
            return {
                ...state,
                loading: false,
                error: action.payload,
                fetchedData: {},
            }
        }
        default: return state;
    }
};

export default songData;