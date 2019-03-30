import React, { Component } from 'react';
import { connect } from "react-redux";
import { fetchSongData } from "../../actions/songDataActions";
import "./SongOverview.css";
//Components
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Nav from "../Nav/Nav.js";
import SongDataGraph from "../SongDataGraph/SongDataGraph";
import Timer from "../Timer/Timer.js";
class SongOverview extends Component {
    componentDidMount() {
        const u = this.props.match.params.u;
        const s = this.props.match.params.s;
        this.props.dispatch(fetchSongData(u, s));
        if (typeof this.props.songData !== "undefined" && typeof this.props.songData.title !== "undefined") this.addSongToHistory(this.props.songData);
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            const u = this.props.match.params.u;
            const s = this.props.match.params.s;
            this.props.dispatch(fetchSongData(u, s));
        }
        if (typeof this.props.songData !== "undefined" && typeof this.props.songData.title !== "undefined" && prevProps.songData.title !== this.props.songData.title) this.addSongToHistory(this.props.songData);
    }
    addSongToHistory = (songData) => {
        // check if key is in store
        if (localStorage.getItem("songHistory") === null) localStorage.setItem("songHistory", JSON.stringify([{ title: songData.title, url: songData.url }]));
        else {
            const newStore = JSON.parse(localStorage.getItem("songHistory"));
            // preventing duplicates.
            for (let i = 0; i < newStore.length; i++) {
                const x = newStore[i];
                if (x.title === songData.title && x.url === songData.url) {
                    //remove and let code continue
                    newStore.splice(i, 1);
                }
            }
            newStore.unshift({ title: songData.title, url: songData.url });
            if (newStore.length > 10) newStore.pop();
            localStorage.setItem("songHistory", JSON.stringify(newStore));
        }
    }
    onTimerEnd = () => {
        const u = this.props.match.params.u;
        const s = this.props.match.params.s;
        this.props.dispatch(fetchSongData(u, s));
    }
    render() {
        return (
            <section id="SongOverview">
                <Nav history={this.props.history} />
                {
                    this.props.loading ?
                        (<LoadingWheel />) :
                        this.props.error ?
                            <div>Error {this.props.error}</div> :
                            <div>
                                <div id="song-iframe-wrapper">
                                    <iframe id="song-iframe" scrolling="no" frameborder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.props.songData.songId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}></iframe>
                                </div>
                                <SongDataGraph songData={this.props.songData} />
                                <Timer onEnd={this.onTimerEnd} preLabel={"Updating in "} postLabel={""} startTime={Date.now()} endTime={this.props.songData.lastUpdated + this.props.songData.offsetTimer} />
                            </div>
                }
            </section>
        );
    }
}

const mapStateToProps = state => ({
    songData: state.songData.fetchedData,
    loading: state.songData.loading,
    error: state.songData.error
});

export default connect(mapStateToProps)(SongOverview);

