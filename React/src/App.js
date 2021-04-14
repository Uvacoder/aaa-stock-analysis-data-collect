import React from "react";
import Home from "./Components/Home";
import { BrowserRouter as Router } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <Router>
        <Home />
      </Router>
    );
  }
}

export default App;
