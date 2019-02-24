import React, { Component } from 'react';
import { Redirect } from 'react-router'
import "./Home.css";
class Home extends Component {
    state = {
        searchText: "",
        redirect: false,
        redirectLocation: "",
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
        this.props.fetchSongData(_state.searchText);
        _state.redirect = true;
        _state.redirectLocation = "/song";
        this.setState(_state);
    }
    render() {
        return this.state.redirect === false ? (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <form id="home-search" onSubmit={this.handleSearchSubmit}>
                    <input type="text" onChange={this.updateSearchText} value={this.state.searchText} placeholder="Paste in song url and hit Enter" />
                    <input type="submit" style={{ display: "none" }} />
                </form>
            </section>
        ) : (
                <Redirect to={this.state.redirectLocation} />
            );
    }
}

export default Home;
