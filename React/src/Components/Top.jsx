import { Paper, Typography } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Loader from "react-loader-spinner";

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      num: 10,
      type: "buy",
      topCompanies: [],
    };
  }

  componentDidMount = () => {
    console.log("Top");
    const { match } = this.props;
    const { num, type } = match.params;
    this.setState({ num: num, type: type, loading: true }, () => {});

    axios.get("/previousdaystockdetails").then((s) => {
      let companyStockDetails = s.data;
      if (type === "sell") {
        companyStockDetails.sort((a, b) => {
          return a["Close Price"] - b["Close Price"];
        });
      } else if (type === "buy") {
        companyStockDetails.sort((a, b) => {
          return b["Close Price"] - a["Close Price"];
        });
      }
      companyStockDetails = companyStockDetails.slice(0, num);
      let topCompanies = [];
      for (let index = 0; index < companyStockDetails.length; index++) {
        const element = companyStockDetails[index];
        topCompanies.push(element["company"]);
      }
      this.setState({ topCompanies: topCompanies, loading: false }, () => {});
    });
  };

  render() {
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Loader />
        ) : (
          <div>
            <Paper
              elevation={1}
              style={{
                display: "flex",
                padding: "15px",
                margin: "15px",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                Top {this.state.num} Companies for{" "}
                {this.state.type === "buy" ? "Investing" : "Trading"}
              </Typography>
            </Paper>
            {this.state.topCompanies.map((company) => {
              return (
                <NavLink
                  style={{ textDecoration: "none" }}
                  key={uuidv4()}
                  to={{
                    pathname: "/companydetails/" + company,
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{ display: "flex", padding: "10px", margin: "10px" }}
                  >
                    <Typography variant="h6">{company}</Typography>
                  </Paper>
                </NavLink>
              );
            })}
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default Top;
