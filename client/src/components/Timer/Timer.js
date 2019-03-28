import React, { Component } from 'react';
import { connect } from "react-redux";
import { initTimer, decTimer } from "../../actions/timerActions";
class Timer extends Component {
    componentWillMount = () => {
        this.convertTime();
    }
    convertTime = () => {
        //CURRENTLY CONVERTING TO SECONDS. MAY WANT TO CHANGE IN THE FUTURE.
        const diff = this.props.endTime - this.props.startTime;
        this.props.initTimer(Math.ceil(diff / 1000));
    }
    updateTimer = () => {
        if (this.props.timeLeft > 0) {
            setTimeout(() => {
                //CURRENTLY ON  A ONE SECOND INTERVAL
                this.props.decTimer(1);
            }, 1000);
        } else if (typeof this.props.onEnd !== "undefined") this.props.onEnd();
    }
    formatTime = (s) => {
        //MM:SS format
        if (s < 1) return "00:00";

        let min = Math.floor(s / 60) < 10 ? "0" + Math.floor(s / 60) : Math.floor(s / 60),
            sec = s % 60 < 10 ? "0" + s % 60 : s % 60;

        return `00:${min}:${sec}`;
    }
    render() {
        this.updateTimer();
        return (
            <div className="timer-wrapper">
                <h1 className="timer-label">{this.props.preLabel} {this.formatTime(this.props.timeLeft)} {this.props.postLabel}</h1>
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        timeLeft: state.timer.timeLeft,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        decTimer: (content) => { dispatch(decTimer(content)) },
        initTimer: (content) => { dispatch(initTimer(content)) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer);
