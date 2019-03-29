import React from "react";
import { Line } from 'react-chartjs-2';

const formatDate = (ms) => {
    const d = new Date(ms), year = d.getFullYear(), month = d.getMonth() + 1, day = d.getDate();
    let min = d.getMinutes(), h = d.getHours(), label = h >= 12 ? "PM" : "AM";

    if (min < 10) min = "0" + min;
    h = h < 1 ? h = 12 : h >= 13 ? h -= 12 : h;

    return `${h}:${min}${label} ${month}/${day}/${year.toString().substring(2)}`;
}
const generateGraphData = (songData) => {
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
        labels.push(formatDate(x.timeStamp));
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
const buildGraphs = (graphData) => {
    return graphData.map((data) => {
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
}
const SongDataGraph = ({ songData }) => {
    let graphs = null;
    if (typeof songData.data !== "undefined") {
        const graphData = generateGraphData(songData);
        graphs = buildGraphs(graphData);
    }
    return (
        <ul className="graphs-wrapper">
            {graphs}
        </ul>
    );
}

export default SongDataGraph;