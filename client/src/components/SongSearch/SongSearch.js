import React, { Component } from 'react';
import "./SongSearch.css";
class SongSearch extends Component {
    state = {
        searchText: "",
    }
    updateSearchText = (e) => {
        const text = e.target.value;
        const _state = this.state;
        _state.searchText = text;
        this.setState(_state);
    }
    handleSearchSubmit = (e) => {
        e.preventDefault();
        const _state = this.state;
        let url = _state.searchText;
        url = url.replace("https://", "");
        url = url.replace("http://", "");
        const urlArr = url.split("/");
        console.log(this.props);
        this.props.history.push(`/songdata?u=${urlArr[1]}&s=${urlArr[2]}`);
    }
    render() {
        return (
            <form className="song-search" onSubmit={this.handleSearchSubmit}>
                <input type="text" onChange={this.updateSearchText} value={this.state.searchText} placeholder="Paste in song url and hit Enter" />
                <input type="submit" style={{ display: "none" }} />
            </form>
        );
    }
}

export default SongSearch;
