import { UPDATE_TEXT } from "./actionTypes";
export const updateText = content => {
    return {
        type: UPDATE_TEXT,
        payload: content
    }
}