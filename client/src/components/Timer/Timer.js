import React, { Component } from 'react';
class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timeToDisplay: 0,
            preLabel: this.props.preLabel || "",
            postLabel: this.props.postLabel || "",
            startTime: this.props.startTime, //expected to be passed down in ms.
            endTime: this.props.endTime, //expected to be passed down in ms.
        }
    }
    componentWillMount = () => {
        this.convertTime();
    }
    updateTimer = () => {
        const _state = this.state;
        if (_state.timeToDisplay > 0) {
            setTimeout(() => {
                //CURRENTLY ON  A ONE SECOND INTERVAL
                _state.timeToDisplay -= 1;
                this.setState(_state);
            }, 1000);
        }
    }
    convertTime = () => {
        //CURRENTLY CONVERTING TO SECONDS. MAY WANT TO CHANGE IN THE FUTURE.
        const _state = this.state;
        const diff = _state.endTime - _state.startTime;
        _state.timeToDisplay = Math.ceil(diff / 1000);
        this.setState(_state);
    }
    render() {
        this.updateTimer();
        return (
            <div className="timer-wrapper">
                <h1 className="timer-label">{this.state.preLabel} {this.state.timeToDisplay} {this.state.postLabel}</h1>
            </div>
        );
    }
}

export default Timer;
