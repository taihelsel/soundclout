import { FETCH_SONGDATA_BEGIN, FETCH_SONGDATA_SUCCESS, FETCH_SONGDATA_FAILURE } from "./actionTypes";

// const fetchSongData = (u, s) => {
//     const targetUrl = `https://soundcloud.com/${u}/${s}`;

//         .then((res) => res.json())
//     .then((res) => {
//         res.lastUpdated = new Date(res.lastUpdated).getTime();
//         const _state = this.state;
//         _state.dataFetched = true;
//         _state.u = u;
//         _state.s = s;
//         _state.songData = res;
//         _state.graphData = this.generateGraphData(res);
//         this.addSongToHistory(res);
//         this.setState(_state);
//     });
// }
export const fetchSongData = (u, s) => dispatch => {
    const targetUrl = `https://soundcloud.com/${u}/${s}`;
    dispatch(fetchSongDataBegin());
    return fetch("/songdata", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ targetUrl })
    })
        .then(res => res.json())
        .then(res => {
            res.lastUpdated = new Date(res.lastUpdated).getTime(); //formats db timestamp
            dispatch(fetchSongDataSuccess(res));
            return res;
        })
        .catch(error =>
            dispatch(fetchSongDataFailure(error))
        );
}

export const fetchSongDataBegin = () => {
    return {
        type: FETCH_SONGDATA_BEGIN,
    }
}
export const fetchSongDataSuccess = songData => {
    return {
        type: FETCH_SONGDATA_SUCCESS,
        payload: songData,
    }
}
export const fetchSongDataFailure = error => {
    return {
        type: FETCH_SONGDATA_FAILURE,
        payload: error,
    }
}