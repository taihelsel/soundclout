import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import "./SongOverview.css";
//Components
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Nav from "../Nav/Nav.js";
import Timer from "../Timer/Timer.js";
class SongOverview extends Component {
    state = {
        songData: {}, //response from the back end containing all the song information
        graphData: [], //an array of datasets formatted for the react-chartjs-2
        dataFetched: false, //false will render loading wheel. true renders songoverview
        u: "",
        s: "",
    }
    componentWillMount() {
        const url = new URL(window.location.href);
        const u = url.searchParams.get("u");
        const s = url.searchParams.get("s");
        this.fetchSongData(u, s);
    }
    onTimerEnd = () => {
        const _state = this.state;
        _state.dataFetched = false;
        this.setState(_state);
        this.fetchSongData(this.state.u, this.state.s);
    }
    fetchSongData = (u, s) => {
        const targetUrl = `https://soundcloud.com/${u}/${s}`;
        fetch("/songdata", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ targetUrl })
        })
            .then((res) => res.json())
            .then((res) => {
                let d = new Date(res.lastUpdated);
                const _state = this.state;
                _state.dataFetched = true;
                _state.u = u;
                _state.s = s;
                res.lastUpdated = d.getTime();
                _state.songData = res;
                _state.graphData = this.generateGraphData(res);
                this.addSongToHistory(res);
                this.setState(_state);
            });
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
    render() {
        return (
            <section id="SongOverview">
                <Nav />
                {this.state.dataFetched ?
                    (<div>
                        <div id="song-iframe-wrapper">
                            <iframe id="song-iframe" scrolling="no" frameborder="no" allow="autoplay" src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${this.state.songData.songId}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}></iframe>
                        </div>
                        {this.renderGraphs()}
                        <Timer onEnd={this.onTimerEnd} preLabel={"Updating in "} postLabel={""} startTime={Date.now()} endTime={this.state.songData.lastUpdated + this.state.songData.offsetTimer} />
                    </div>)
                    : (<LoadingWheel />)
                }
            </section>
        );
    }
}

export default SongOverview;
