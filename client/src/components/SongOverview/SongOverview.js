import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import "./SongOverview.css";
//Components
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Nav from "../Nav/Nav.js";
class SongOverview extends Component {
    state = {
        songData: {},
        graphData: {},
        dataFetched: false,
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
                const _state = this.state;
                _state.dataFetched = true;
                _state.songData = res;
                _state.graphData = this.generateGraphData(res);
                this.setState(_state);
            });
    }
    generateGraphData = (songData) => {
        const playsDataset = {
            label: "Plays",
            data: [],
            borderColor: "#3e95cd",
            fill: false
        };
        const likesDataSet = {
            label: "Likes",
            data: [],
            borderColor: "#8e5ea2",
            fill: false
        };
        const commentsDataSet = {
            label: "Comments",
            data: [],
            borderColor: "#3cba9f",
            fill: false
        };
        const graphData = {
            labels: [], //will contain the timestamps
            datasets: [playsDataset, likesDataSet, commentsDataSet], //will contain the data (label,color,data history) for each item (likes,comments, etc)
            options: {
                title: {
                    display: true,
                    text: "Song History"
                }
            }
        };
        const data = songData.data;
        for (let i = 0; i < data.length; i++) {
            let x = data[i];
            //adding timestamp
            graphData.labels.push(x.timeStamp);
            //updating datasets
            playsDataset.data.push(x.plays);
            likesDataSet.data.push(x.likes);
            commentsDataSet.data.push(x.comments);
        }
        return graphData;
    }
    render() {
        return (
            <section id="SongOverview">
                <Nav />
                {this.state.dataFetched ?
                    (<div>
                        {JSON.stringify(this.state.songData)}
                        <Line
                            data={this.state.graphData}
                            width={100}
                            height={50}
                        />
                    </div>)
                    : (<LoadingWheel />)
                }
            </section>
        );
    }
}

export default SongOverview;
