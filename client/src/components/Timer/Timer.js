import React, { Component } from 'react';
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeLeft: 0,
            preLabel: this.props.preLabel || "",
            postLabel: this.props.postLabel || "",
            startTime: this.props.startTime, //expected to be passed down in ms.
            endTime: this.props.endTime, //expected to be passed down in ms.
        }
    }
    componentWillMount = () => {
        this.convertTime();
    }
    convertTime = () => {
        //CURRENTLY CONVERTING TO SECONDS. MAY WANT TO CHANGE IN THE FUTURE.
        const _state = this.state;
        const diff = _state.endTime - _state.startTime;
        _state.timeLeft = Math.ceil(diff / 1000);
        this.setState(_state);
    }
    updateTimer = () => {
        const _state = this.state;
        if (_state.timeLeft > 0) {
            setTimeout(() => {
                //CURRENTLY ON  A ONE SECOND INTERVAL
                _state.timeLeft -= 1;
                this.setState(_state);
            }, 1000);
        }else {
            if(typeof this.props.onEnd !== "undefined") this.props.onEnd();
        }
    }
    formatTime = (s) => {
        //MM:SS format
        if (s < 1) return "00:00";

        let min = Math.floor(s / 60) < 10 ? "0" + Math.floor(s / 60) : Math.floor(s / 60), sec = s % 60 < 10 ? "0" + s % 60 : s % 60;

        return `00:${min}:${sec}`;
    }
    render() {
        this.updateTimer();
        return (
            <div className="timer-wrapper">
                <h1 className="timer-label">{this.state.preLabel} {this.formatTime(this.state.timeLeft)} {this.state.postLabel}</h1>
            </div>
        );
    }
}

export default Timer;
