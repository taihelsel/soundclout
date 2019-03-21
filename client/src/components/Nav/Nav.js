import React, { Component } from "react";
import "./Nav.css";
//Components
import SongSearch from "../SongSearch/SongSearch.js";
class Nav extends Component {
    handleNavBack = () => {
        this.props.history.push("/");
    }
    render() {
        return (
            <nav>
                <h3 id="nav-back-arrow" onClick={this.handleNavBack}>⬅</h3>
                <SongSearch history={this.props.hitory} />
            </nav>
        );
    }
}
export default Nav;