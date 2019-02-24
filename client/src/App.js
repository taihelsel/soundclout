import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

//Components
import Home from "./components/Home/Home.js";
import SongOverview from "./components/SongOverview/SongOverview.js";
class App extends Component {
  state = {
    songData: {}
  }
  fetchSongData = (targetUrl) => {
    fetch("/test", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({targetUrl})
    })
      .then((res) => res.json())
      .then((res) => {
        const _state = this.state;
        _state.songData = res;
        this.setState(_state);
      })
  }
  render() {
    console.log("songdata", this.state.songData);
    return (
      <Router>
        <div style={{ width: "100%", height: "fit-content" }}>
          <Route exact path="/" render={() => <Home fetchSongData={this.fetchSongData} /> } />
          <Route exact path="/song" render={() => <SongOverview fetchSongData={this.fetchSongData} songData={this.state.songData} /> } />
        </div>
      </Router>
    );
  }
}

export default App;
