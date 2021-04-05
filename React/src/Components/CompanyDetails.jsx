import React from "react";
import firebase from "firebase";
import moment from "moment";
import {
  Card,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import NumberFormat from "react-number-format";

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyDetails: [],
      companyCurrentDayStockDetails: [],
      companyStockDetails: [],
      percent: "",
      company: "",
      keys: [
        "Date",
        "Open Price",
        "High Price",
        "Low Price",
        "Close Price",
        "WAP",
        "Noof Shares",
        "No of Trades",
        "Total Turnover (Rs)",
        "Deliverable Quantity",
        "% Deli Qty to Traded Qty",
        "Spread High-Low",
        "Spread Close-Open",
        "Unix Date",
      ],
    };
  }

  componentDidMount = () => {
    console.log("CompanyDetails");
    var company = "";
    if (this.props.match === undefined && this.props.selectedCompany !== "") {
      this.setState({ company: this.props.selectedCompany }, () => {});
      company = this.props.selectedCompany;
    } else {
      this.setState({ company: this.props.match.params.company }, () => {});
      company = this.props.match.params.company;
    }
    this.getCompanyDetailsFromFirebase(company);
    this.getCompanyCurrentDayStockDetailsFromFirebase(company);
    this.getCompanyStockDetailsFromFirebase(company);
  };

  getCompanyDetailsFromFirebase = (company) => {
    const dbref = firebase.database().ref().child("companies");
    dbref.child(company).on(
      "value",
      (snap) => {
        if (snap.val() === null) {
        } else {
          this.setState({ companyDetails: snap.val() }, () => {});
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCompanyCurrentDayStockDetailsFromFirebase = (company) => {
    let yesterday = moment().startOf("day").unix().toString();
    const dbref = firebase.database().ref().child("stocks").child(company);
    dbref.child(yesterday).on(
      "value",
      (snap) => {
        if (snap.val() === null) {
        } else {
          this.setState(
            { companyCurrentDayStockDetails: snap.val() },
            () => {}
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCompanyStockDetailsFromFirebase = (company) => {
    const dbref = firebase.database().ref().child("stocks");
    console.log(company);
    dbref.child(company).on(
      "value",
      (snap) => {
        if (snap.val() === null) {
        } else {
          this.setState({ companyStockDetails: snap.val() }, () => {});
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getCount() {
    console.log("getCount");
    console.log(this.state.companyStockDetails);
  }

  render() {
    if (this.state.companyDetails.length !== 0) {
      var companyDetails = Object.keys(this.state.companyDetails).map((key) => {
        return (
          <Grid
            item
            style={{
              margin: "10px",
              padding: "10px",
              border: "1px solid black",
            }}
          >
            <Typography style={{ float: "left", marginRight: "10px" }}>
              {key}
            </Typography>
            <Typography style={{ float: "right" }}>
              {this.state.companyDetails[key]}
            </Typography>
          </Grid>
        );
      });
    }
    if (this.state.companyCurrentDayStockDetails.length !== 0) {
      var companyCurrentDayStockDetails = this.state.keys.map((key) => {
        return (
          <Grid
            item
            xs={3}
            style={{
              margin: "10px",
              padding: "10px",
            }}
          >
            <Typography style={{ float: "left", marginRight: "10px" }}>
              {key}
            </Typography>
            <Typography style={{ float: "right" }}>
              {this.state.companyCurrentDayStockDetails[key]}
            </Typography>
          </Grid>
        );
      });
    }

    if (
      this.state.companyStockDetails.length !== 0 &&
      this.state.percent !== ""
    ) {
      const percent = this.state.percent / 100;
      var total = 0;
      for (const key in this.state.companyStockDetails) {
        if (Object.hasOwnProperty.call(this.state.companyStockDetails, key)) {
          const element = this.state.companyStockDetails[key];
          if (element["Next Day Close Price GR"] > percent) {
            total = total + 1;
          }
        }
      }
      console.log(total);
    }

    return (
      <React.Fragment>
        {this.state.company !== "" && companyDetails !== undefined && (
          <Paper
            elevation={3}
            style={{
              display: "flex",
              padding: "15px",
              margin: "15px",
              justifyContent: "center",
            }}
          >
            <Typography>{this.state.company}</Typography>
          </Paper>
        )}
        <Grid container> {companyDetails}</Grid>
        {companyDetails !== undefined && (
          <NumberFormat
            value={this.state.percent}
            id="percent"
            placeholder="percent"
            onChange={(e) => {
              let val = e.target.value;
              if (val == "" || val > 100 || val < -100) {
                this.setState({ percent: "" }, () => {});
              }
            }}
            onKeyPress={(e) => {
              let val = e.target.value;
              if (e.key == "Enter" && val != "" && val <= 100 && val >= -100) {
                this.setState({ percent: val }, () => {});
              }
            }}
          />
        )}

        {this.state.percent !== "" &&
          this.state.companyStockDetails.length !== 0 && <h1>{total}</h1>}
      </React.Fragment>
    );
  }
}
export default CompanyDetails;
