import React from "react";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCompanyDetails :[]
    };
  }

  componentDidMount = () => {
    console.log("Dashboard");
    this.setState({selectedCompanyDetails:this.props.selectedCompanyDetails},()=>{})
  };
  render() {
    let res = Object.keys(this.state.selectedCompanyDetails).map((key)=>{return key})
    console.log(res)
    return (
      <React.Fragment>
        <h1>Dashboard</h1>
      </React.Fragment>
    );
  }
}

export default Dashboard;
