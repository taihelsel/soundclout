import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

//Components
import Home from "./components/Home/Home.js";

class App extends Component {
  render() {
    return (
      <Router>
        <div style={{width:"100%",height:"fit-content"}}>
          <Route exact path="/" component={Home} />
        </div>
      </Router>
    );
  }
}

export default App;
