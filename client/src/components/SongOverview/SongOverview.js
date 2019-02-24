import React, { Component } from 'react';
import "./SongOverview.css";
class SongOverview extends Component {
    state={
        songData:{},
    }
    componentWillMount(){
        this.getSongData();
    }
    getSongData = () => {
        fetch("/test",{
            method: "POST",
        })
        .then((res)=>res.json())
        .then((res)=>{
            const _state=this.state;
            _state.songData = res;
            this.setState(_state);
        })
    }
    render() {
        return (
            <section id="SongOverview">
                {JSON.stringify(this.state.songData)}
            </section>
        );
    }
}

export default SongOverview;
