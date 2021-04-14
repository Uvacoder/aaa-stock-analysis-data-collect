import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import NumberFormat from "react-number-format";
import axios from "axios";
import underscore from "underscore";
import Dashboard from "./Dashboard";
import Loader from "react-loader-spinner";

const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyDetails: [],
      companyCurrentDayStockDetails: [],
      companyStockDetails: [],
      rate: "",
      loading: false,
      selectedCompany: "",
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
      timePeriod: {
        "1 day": "1",
        "7 days": "7",
        "1 month": "30",
        "3 months": "90",
        "6 months": "180",
        "1 year": "360",
        "2 years": "720",
        "5 years": "1800",
        "10 years": "3600",
      },
      selectedTimePeriod: 180,
      response: [],
    };
  }

  componentDidMount = () => {
    console.log("CompanyDetails");
    const { match } = this.props;
    const company = match.params.company;
    this.setState({ selectedCompany: company }, () => {
      this.getCompanyDetails(this.state.selectedCompany);
    });
  };

  getCompanyDetails = (company) => {
    axios.get("/companydetails?company=" + company).then((s) => {
      this.setState({ companyDetails: s.data }, () => {});
    });
  };

  compute = () => {
    axios
      .get(
        "/topCompanies?days=" +
          this.state.selectedTimePeriod +
          "&rate=" +
          this.state.rate / 100 +
          "&company=" +
          this.state.selectedCompany
      )
      .then((s) => {
        let result = s.data;
        result["period"] = underscore.invert(this.state.timePeriod)[
          this.state.selectedTimePeriod
        ];
        this.setState({ response: result, loading: false }, () => {});
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.selectedCompany === "" ? (
          <div></div>
        ) : (
          <div>
            <Paper
              elevation={3}
              style={{
                display: "flex",
                padding: "15px",
                margin: "15px",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">{this.state.selectedCompany}</Typography>
            </Paper>
            <Grid container>
              {Object.keys(this.state.companyDetails).map((key) => {
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
              })}
            </Grid>
            <Grid container>
              <Grid item>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel id="trading-period-label">
                    trading period
                  </InputLabel>
                  <Select
                    labelId="trading period"
                    id="trading"
                    onChange={(e) => {
                      this.setState(
                        { selectedTimePeriod: e.target.value },
                        () => {}
                      );
                    }}
                    value={this.state.selectedTimePeriod}
                  >
                    {Object.keys(this.state.timePeriod).map((period) => {
                      return (
                        <MenuItem value={this.state.timePeriod[period]}>
                          {period}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <NumberFormat
                  style={{ width: "75%", height: "75%", marginTop: "10px" }}
                  value={this.state.rate}
                  id="rate"
                  placeholder="x % rate increase close price gr"
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "" || val > 100 || val < -100) {
                      this.setState({ rate: "" }, () => {});
                    }
                  }}
                  onKeyPress={(e) => {
                    let val = e.target.value;
                    if (
                      e.key === "Enter" &&
                      val !== "" &&
                      val <= 100 &&
                      val >= -100
                    ) {
                      this.setState({ rate: val, loading: true }, () => {
                        this.compute();
                      });
                    }
                  }}
                />
              </Grid>
            </Grid>
          </div>
        )}

        {this.state.loading ? (
          <Loader />
        ) : (
          this.state.response.length !== 0 && (
            <h1>
              In the last {this.state.response["period"]}, for{" "}
              {this.state.response["percentOfDays"]} percent of trading days{" "}
              {this.state.response["company"]} growth rate was more than{" "}
              {this.state.response["rate"]}
            </h1>
          )
        )}
        {this.state.selectedCompany !== "" && (
          <Dashboard company={this.state.selectedCompany} />
        )}
      </React.Fragment>
    );
  }
}
export default withStyles(styles)(CompanyDetails);
