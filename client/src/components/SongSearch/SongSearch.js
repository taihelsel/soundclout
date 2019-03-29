import React from 'react';
import { connect } from "react-redux";
import { updateText } from "../../actions/searchActions";
import "./SongSearch.css";

const handleSearchInput = updateText => e => {
    const text = e.target.value;
    updateText(text);
}
const handleSearchSubmit = (history, searchText, updateText) => e => {
    e.preventDefault();
    let url = searchText;
    url = url.replace("https://", "");
    url = url.replace("http://", "");
    const urlArr = url.split("/");
    history.push(`/songdata/${urlArr[1]}/${urlArr[2]}`);
    updateText("");
}
const SongSearch = ({ history, searchText, updateText }) => {
    return (
        <form className="song-search" onSubmit={handleSearchSubmit(history, searchText, updateText)}>
            <input type="text" onChange={handleSearchInput(updateText)} value={searchText} placeholder="Paste in song url and hit Enter" />
            <input type="submit" style={{ display: "none" }} />
        </form>
    );
}

const mapStateToProps = (state) => {
    return {
        searchText: state.searchText,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateText: (content) => { dispatch(updateText(content)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SongSearch);

