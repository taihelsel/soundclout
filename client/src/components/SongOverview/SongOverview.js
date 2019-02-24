import React, { Component } from 'react';
import "./SongOverview.css";
class SongOverview extends Component {
    componentWillMount(){
        this.pingTestRoute();
    }
    pingTestRoute = () => {
        fetch("/test",{
            method:"POST",
        })
        .then((res)=>res.json())
        .then((res)=>{
            console.log(res);
        });
    }
    render() {
        return (
            <section id="SongOverview">
                SongOverview
            </section>
        );
    }
}

export default SongOverview;
