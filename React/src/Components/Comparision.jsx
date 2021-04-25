import React from "react";
import axios from "axios";
import underscore from "underscore";
import Autocomplete from "@material-ui/lab/Autocomplete";

import {
  FormControl,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  Paper,
  Select,
  Typography,
  TextField,
  Chip,
  Divider,
} from "@material-ui/core";
import Loader from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import Dashboard from "./Dashboard";
class Comparision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      companyNames: [],
      selectedCompanies: [],
      selectedTimePeriod: "180",
      rate: "1",
      stockkeys: [
        "Date",
        "Open Price",
        "High Price",
        "Low Price",
        "Close Price",
        "WAP",
        "No.of Shares",
        "No. of Trades",
        "Total Turnover (Rs.)",
        "% Deli. Qty to Traded Qty",
        "Spread High-Low",
        "Spread Close-Open",
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
      stockdetails: [],
      num: 10,
      error: "",
    };
  }

  componentDidMount = () => {
    console.log("Comparision");
    axios
      .get("/companynames")
      .then((s) => {
        if (s.status === 200) {
          this.setState({ companyNames: s.data }, () => {});
        } else {
          this.setState({ companyNames: s.data }, () => {});
        }
      })
      .catch((e) => console.log(e));
  };

  onClickSubmit = async () => {
    if (this.state.selectedCompanies.length < 2) {
      this.setState({ error: "select atleast two companies" }, () => {});
      return;
    } else {
      this.setState({ error: "", loading: true }, () => {});
    }
    let stockdetails = {};
    for (let index = 0; index < this.state.selectedCompanies.length; index++) {
      const company = this.state.selectedCompanies[index];
      stockdetails[company] = {};
    }
    for (let index = 0; index < this.state.selectedCompanies.length; index++) {
      const company = this.state.selectedCompanies[index];
      await axios
        .get("/previousdaystockdetails?company=" + company)
        .then((s) => {
          if (s.status === 200) {
            stockdetails[company] = Object.assign(
              stockdetails[company],
              s.data
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
      await axios
        .get(
          "/topCompanies?days=" +
            this.state.selectedTimePeriod +
            "&rate=" +
            this.state.rate / 100 +
            "&company=" +
            company
        )
        .then((s) => {
          if (s.status === 200) {
            stockdetails[company] = Object.assign(
              stockdetails[company],
              s.data
            );
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    this.setState({ stockdetails: stockdetails, loading: false }, () => {});
  };

  render() {
    const period = underscore.invert(this.state.timePeriod);
    return (
      <React.Fragment>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={4}>
            <Autocomplete
              multiple
              value={this.state.firstCompany}
              onChange={(e, company, reason, detail) => {
                if (reason === "remove-option") {
                  let companies = this.state.stockdetails;
                  delete companies[detail.option];
                  this.setState({ stockdetails: companies }, () => {});
                } else {
                  this.setState({ selectedCompanies: company }, () => {});
                }
              }}
              id="select multiple companies"
              freeSolo
              options={this.state.companyNames.map(
                (companyname) => companyname
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="select multiple companies"
                  margin="normal"
                  variant="outlined"
                  helperText={this.state.error}
                  error={this.state.error !== ""}
                />
              )}
            />
          </Grid>
          <Grid item>
            <FormControl style={{ minWidth: "150px" }} variant="outlined">
              <InputLabel>trading period</InputLabel>
              <Select
                style={{ width: "100%" }}
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
          <Grid item xs={2}>
            <TextField
              type="number"
              style={{ width: "100%" }}
              inputProps={{ min: "-100", max: "100", step: "0.01" }}
              label="rate of growth"
              variant="outlined"
              value={this.state.rate}
              onChange={(e) => {
                this.setState({ rate: e.target.value });
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              size="large"
              onClick={this.onClickSubmit}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <Divider />
        {this.state.loading ? (
          <Loader />
        ) : (
          this.state.stockdetails.length !== 0 && (
            <Grid
              container
              spacing={1}
              direction="row"
              justify="flex-start"
              alignItems="center"
            >
              {Object.keys(this.state.stockdetails).map((company) => {
                const element = this.state.stockdetails[company];
                return (
                  <Grid item xs={6}>
                    <Paper
                      style={{
                        display: "flex",
                        padding: "15px",
                        margin: "15px",
                        justifyContent: "center",
                      }}
                    >
                      <NavLink
                        to={{
                          pathname: "companydetails/" + element["company"],
                        }}
                      >
                        <Typography variant="h6">
                          {element["company"]}
                        </Typography>
                      </NavLink>
                    </Paper>
                    <Typography variant="h6">
                      In the last {period[element["totalNumberOfDays"]]}, for{" "}
                      {element["percentOfDays"]} percent of trading days close
                      price growth rate was more than {element["rate"]} %
                    </Typography>
                    <Dashboard company={element["company"]} />
                    {this.state.stockkeys.map((key, i) => {
                      let res = key + " : " + element[key];
                      return (
                        <Chip
                          color="primary"
                          variant="outlined"
                          label={res}
                          style={{ margin: "5px" }}
                        />
                      );
                    })}
                  </Grid>
                );
              })}
            </Grid>
          )
        )}
      </React.Fragment>
    );
  }
}

export default Comparision;
