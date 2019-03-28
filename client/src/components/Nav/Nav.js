import React from "react";
import "./Nav.css";
//Components
import SongSearch from "../SongSearch/SongSearch.js";

const handleNavBack = history => e => {
    history.push("/");
}
const Nav = ({ history }) => {
    return (
        <nav>
            <h3 id="nav-back-arrow" onClick={handleNavBack(history)}>⬅</h3>
            <SongSearch history={history} />
        </nav>
    );
}
export default Nav;