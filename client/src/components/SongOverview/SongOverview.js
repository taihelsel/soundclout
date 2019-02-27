import React, { Component } from 'react';
import "./SongOverview.css";
class SongOverview extends Component {
    state = {
        songData: {},
        dataFetched:false,
    }
    componentWillMount() {
        const url = new URL(window.location.href);
        const u = url.searchParams.get("u");
        const s = url.searchParams.get("s");
        this.fetchSongData(u,s);
    }
    fetchSongData = (u,s) => {
        const targetUrl = `https://soundcloud.com/${u}/${s}`;
        fetch("/test", {
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
                this.setState(_state);
            })
    }
    render() {
        return this.state.dataFetched? (
            <section id="SongOverview">
                {JSON.stringify(this.state.songData)}
            </section>
        ):(
            <div>Loading wheel goes here</div>
        );
    }
}

export default SongOverview;
