import React, { Component } from 'react';
import "./Home.css";
//Components
import Nav from "../Nav/Nav.js";
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
    }
    render() {
        return (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <form id="home-search" onSubmit={this.handleSearchSubmit}>
                    <input type="text" onChange={this.updateSearchText} value={this.state.searchText} />
                    <input type="submit" style={{display:"none"}}/>
                </form>
            </section>
        );
    }
}

export default Home;
