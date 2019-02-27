import React, { Component } from 'react';
import "./SongOverview.css";
//Components
import LoadingWheel from "../LoadingWheel/LoadingWheel.js";
import Nav from "../Nav/Nav.js";
class SongOverview extends Component {
    state = {
        songData: {},
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
                this.setState(_state);
            })
    }
    render() {
        return (
            <section id="SongOverview">
                <Nav />
                {this.state.dataFetched ?
                    (<div>
                        {JSON.stringify(this.state.songData)}
                    </div>)
                    : (<LoadingWheel />)
                }
            </section>
        );
    }
}

export default SongOverview;
