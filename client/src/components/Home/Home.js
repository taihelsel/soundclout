import React, { Component } from 'react';
import "./Home.css";
import SongSearch from "../SongSearch/SongSearch.js";
class Home extends Component {
    state = {
        searchText: "",
    }
    formatUrl = (url) => {
        url = url.replace("https://", "");
        url = url.replace("http://", "");
        return url.split("/");
    }
    handleHistoryClick = (url) => {
        url = this.formatUrl(url);
        this.props.history.push(`/songdata/${url[1]}/${url[2]}`);
    }
    renderRecentlyViewed = () => (
        localStorage.getItem("songHistory") !== null ? (
            <ul className="song-history">
                <h1 className="song-history-head">Recently Viewed Songs</h1>
                {JSON.parse(localStorage.getItem("songHistory")).map(item =>
                    <li>
                        <h1 onClick={() => { this.handleHistoryClick(item.url) }}>
                            {item.title}
                        </h1>
                    </li>
                )}
            </ul>
        ) : "");
    render() {
        return (
            <section id="Home">
                <h1 id="home-head">SoundClout</h1>
                <SongSearch history={this.props.history} />
                {this.renderRecentlyViewed()}
            </section>
        );
    }
}

export default Home;
