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
    render() {
        return (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <div id="home-search">
                    <input type="text" onChange={this.updateSearchText} value={this.state.searchText} />
                </div>
            </section>
        );
    }
}

export default Home;
