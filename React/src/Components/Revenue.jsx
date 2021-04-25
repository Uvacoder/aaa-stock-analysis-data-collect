import { Paper, Typography } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Loader from "react-loader-spinner";

class Revenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCompanies: [],
      num: 30,
      loading: true,
    };
  }

  componentDidMount = () => {
    console.log("Revenue");
    axios.get("/previousdaystockdetails").then((s) => {
      if (s.status === 200) {
        let companyStockDetails = s.data;
        companyStockDetails.sort((a, b) => {
          return a["Revenue"] - b["Revenue"];
        });
        companyStockDetails = companyStockDetails.slice(0, this.state.num);
        let topCompanies = [];
        for (let index = 0; index < companyStockDetails.length; index++) {
          const element = companyStockDetails[index];
          topCompanies.push(element["company"]);
        }
        this.setState({ topCompanies: topCompanies, loading: false }, () => {});
      } else {
        this.setState({ topCompanies: [], loading: false }, () => {});
      }
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
                Top {this.state.num} Companies Revenue wise
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

export default Revenue;
