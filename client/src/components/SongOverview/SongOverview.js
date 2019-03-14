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
    }
    componentWillMount() {
        const url = new URL(window.location.href);
        const u = url.searchParams.get("u");
        const s = url.searchParams.get("s");
        this.fetchSongData(u, s);
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
                res.lastUpdated = d.getTime();
                _state.songData = res;
                _state.graphData = this.generateGraphData(res);
                this.setState(_state);
            });
    }
    formatDate = (ms) => {
        let d = new Date(ms);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const day = d.getDate();
        let min = d.getMinutes(), h = d.getHours(), label = "AM";
        switch (true) {
            case min < 10:
                min = min.toString();
                min = "0" + min;
            case h < 1:
                h = 12;
                break;
            case h >= 12:
                label = "PM";
            case h > 12:
                h -= 12;
                break;
        }

        return `${h}:${min}${label} ${month}/${day}/${year.toString().substring(2)}`;
    }
    generateGraphData = (songData) => {
        const labels = []; //will contain the timestamps
        const playsGraph = {
            labels,
            datasets: [{
                label: "Plays",
                data: [],
                borderColor: "#3e95cd",
                fill: false
            }],
        };
        const likesGraph = {
            labels,
            datasets: [{
                label: "Likes",
                data: [],
                borderColor: "#8e5ea2",
                fill: false
            }],
        };
        const commentsGraph = {
            labels,
            datasets: [{
                label: "Comments",
                data: [],
                borderColor: "#3cba9f",
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
                        <Timer preLabel={"Checking for update in "} postLabel={" seconds"} startTime={Date.now()} endTime={this.state.songData.lastUpdated + this.state.songData.offsetTimer} />
                    </div>)
                    : (<LoadingWheel />)
                }
            </section>
        );
    }
}

export default SongOverview;
