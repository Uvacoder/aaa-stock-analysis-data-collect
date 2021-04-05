import React from "react";
import firebase from "firebase";
import { NavLink } from "react-router-dom";
import { Paper, Typography } from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";


class Revenue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyNames: this.props.companyNames,
      topCompanies: [],
      top :10
    };
  }

  componentDidMount = () => {
    console.log("Revenue");
    this.getTopCompanyStockDetailsFromFirebase();
  };

  getTopCompanyStockDetailsFromFirebase = () => {
    console.log("getAllCompanyStockDetailsFromFirebase");
    let companyStockDetails = [];
    const dbref = firebase.database().ref().child("stocks");
    let yesterday = moment().subtract(1, "days").startOf("day").unix().toString();
    this.state.companyNames.map((company) => {
      let path = company + "/" + yesterday;
      dbref.child(path).on(
        "value",
        (snap) => {
          if (snap.val() === null) {
          } else {
            let curr = snap.val();
            curr["company name"] = company;
            companyStockDetails.push(curr);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    });
    companyStockDetails.sort((a, b) => {
      return a["Revenue"] - b["Revenue"];
    });
    companyStockDetails = companyStockDetails.slice(0, this.state.top);
    // this.setState({ topCompanies: companyStockDetails }, () => {
    //   console.log(this.state.topCompanies);
    // });
    setTimeout(() => {
      this.setState({ topCompanies: companyStockDetails }, () => {});
    }, 1000);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.topCompanies.length !== 0 && (
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
              Top 10 Companies for Investing
            </Typography>
          </Paper>
        )}

        {this.state.topCompanies.length !== 0 &&
          this.state.topCompanies.map((company) => {
            return (
              <NavLink
                style={{ textDecoration: "none" }}
                key={uuidv4()}
                to={{
                  pathname: "/companydetails/" + company["company name"],
                  state: { companyname: company["company name"] },
                }}
              >
                <Paper
                  elevation={1}
                  style={{ display: "flex", padding: "10px", margin: "10px" }}
                >
                  <Typography variant="h6">
                    {company["company name"]}
                  </Typography>
                </Paper>
              </NavLink>
            );
          })}
      </React.Fragment>
    );
  }
}

export default Revenue;
