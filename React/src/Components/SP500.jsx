import React from "react";
import Dashboard from "./Dashboard";
import axios from "axios";
class SP500 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { sp500: [] };
  }
  componentDidMount = () => {
    console.log("SP500");
    axios
      .get("/sp500")
      .then((s) => {
        this.setState({ sp500: s.data, loading: false }, () => {});
      })
      .then(() => {})
      .catch((e) => {});
  };
  render() {
    return (
      <React.Fragment>
        <Dashboard company="sp500" />
      </React.Fragment>
    );
  }
}

export default SP500;
