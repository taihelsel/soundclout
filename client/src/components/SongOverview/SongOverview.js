import React from 'react';
import "./SongOverview.css";
const SongOverview = (props) => {
    return (
        <section id="SongOverview">
            {JSON.stringify(props.songData)}
        </section>
    );
}

export default SongOverview;
