import React, { Component } from 'react';
import "./Home.css";
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
        //make request to server here
    }
    render() {
        return (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <form id="home-search" onSubmit={this.handleSearchSubmit}>
                    <input type="text" onChange={this.updateSearchText} value={this.state.searchText} placeholder="Paste in song url and hit Enter"/>
                    <input type="submit" style={{display:"none"}}/>
                </form>
            </section>
        );
    }
}

export default Home;
