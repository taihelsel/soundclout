import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import { connect } from "react-redux";
import { fetchSongData } from "../../actions/songDataActions";
import "./SongOverview.css";
//Components
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Nav from "../Nav/Nav.js";
import Timer from "../Timer/Timer.js";
class SongOverview extends Component {
    componentDidMount() {
        const u = this.props.match.params.u;
        const s = this.props.match.params.s;
        this.props.dispatch(fetchSongData(u, s));
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            const u = this.props.match.params.u;
            const s = this.props.match.params.s;
            this.props.dispatch(fetchSongData(u, s));
        }
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
    formatDate = (ms) => {
        const d = new Date(ms), year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
        let min = d.getMinutes(), h = d.getHours(), label = h >= 12 ? "PM" : "AM";

        if (min < 10) min = "0" + min;
        h = h < 1 ? h = 12 : h >= 13 ? h -= 12 : h;

        return `${h}:${min}${label} ${month}/${day}/${year.toString().substring(2)}`;
    }
    generateGraphData = (songData) => {
        const labels = []; //will contain the timestamps
        const playsGraph = {
            labels,
            datasets: [{
                label: "Plays",
                data: [],
                borderColor: "#FF7E47",
                backgroundColor: "#ff7e47cc",
                fill: false
            }],
        };
        const likesGraph = {
            labels,
            datasets: [{
                label: "Likes",
                data: [],
                borderColor: "#2283c1",
                backgroundColor: "#2283c1cc",
                fill: false
            }],
        };
        const commentsGraph = {
            labels,
            datasets: [{
                label: "Comments",
                data: [],
                borderColor: "#787878",
                backgroundColor: "#787878cc",
                fill: false
            }],
        };
        const data = songData.data;
        for (let i = 0; i < data.length; i++) {
            let x = data[i];
            //adding timestamp
            labels.push(this.formatDate(x.timeStamp));
            //updating datasets
            playsGraph.datasets[0].data.push(x.plays);
            likesGraph.datasets[0].data.push(x.likes);
            commentsGraph.datasets[0].data.push(x.comments);
        }
        return [
            playsGraph,
            likesGraph,
            commentsGraph,
        ];
    }
    renderGraphs = () => {
        const _state = this.state;
        const graphs = _state.graphData.map((data) => {
            return (
                <li>
                    <Line
                        data={data}
                        width={null}
                        height={null}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        autoSkip: true,
                                    }
                                }]
                            },
                        }}
                    />
                </li>
            )
        });
        return (
            <ul className="graphs-wrapper">
                {graphs}
            </ul>
        );
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
                                {/* {this.renderGraphs()} */}
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

