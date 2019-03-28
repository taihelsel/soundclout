import { INIT_TIMER, DEC_TIMER } from "./actionTypes";

export const initTimer = content => {
    return {
        type: INIT_TIMER,
        payload: content
    }
}
export const decTimer = content => {
    return {
        type: DEC_TIMER,
        payload: content
    }
}