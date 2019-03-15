import React, { Component } from 'react';
import "./Home.css";
import SongSearch from "../SongSearch/SongSearch.js";
class Home extends Component {
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
        window.location.href = `/songdata?u=${urlArr[1]}&s=${urlArr[2]}`;
    }
    render() {
        return (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <SongSearch />
                {
                    localStorage.getItem("songHistory") !== null ? JSON.parse(localStorage.getItem("songHistory")).map(item => <div>{JSON.stringify(item)}</div>) : ""
                }
            </section>
        );
    }
}

export default Home;
