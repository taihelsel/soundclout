import React from 'react';
import "./LoadingWheel.css";
const styles = {
    position:"absolute",
    top:"50vh",
    left:"50vw",
}
const LoadingWheel = () => (
    <div style={styles}>
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
)

export default LoadingWheel;