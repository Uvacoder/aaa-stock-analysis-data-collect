import React from "react";

class PageNotFound extends React.Component {
  componentDidMount = () => {
    console.log("PageNotFound");
  };

  render() {
    return (
      <React.Fragment>
        <h1>Page Not Found</h1>
      </React.Fragment>
    );
  }
}

export default PageNotFound;
