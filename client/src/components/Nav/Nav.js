import React, { Component } from "react";
import "./Nav.css";
//Components
import SongSearch from "../SongSearch/SongSearch.js";
class Nav extends Component {
    handleNavBack = () => {
        window.location.href = "/";
    }
    render() {
        return (
            <nav>
                <h3 id="nav-back-arrow" onClick={this.handleNavBack}>⬅</h3>
                <SongSearch />
            </nav>
        );
    }
}
export default Nav;