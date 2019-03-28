import React from 'react';
import "./Home.css";
import SongSearch from "../SongSearch/SongSearch.js";
import SongHistory from "../SongHistory/SongHistory.js";

const formatUrl = (url) => {
    url = url.replace("https://", "");
    url = url.replace("http://", "");
    return url.split("/");
}
const handleHistoryClick = (history, url) => e => {
    url = formatUrl(url);
    history.push(`/songdata/${url[1]}/${url[2]}`);
}
const renderRecentlyViewed = (history) => (
    localStorage.getItem("songHistory") !== null ? <SongHistory handleHistoryClick={handleHistoryClick} history={history} /> : ""
);
const Home = ({ history }) => {
    return (
        <section id="Home">
            <h1 id="home-head">SoundClout</h1>
            <SongSearch history={history} />
            {renderRecentlyViewed(history)}
        </section>
    );
}

export default Home;
