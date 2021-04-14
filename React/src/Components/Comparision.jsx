import React from "react";
import axios from "axios";
import underscore from "underscore";
import {
  FormControl,
  Grid,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
  withStyles,
} from "@material-ui/core";
import NumberFormat from "react-number-format";
import Loader from "react-loader-spinner";
import { NavLink } from "react-router-dom";
const styles = (theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class Comparision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      companyNames: [],
      selectedCompany: "",
      selectedTimePeriod: "",
      rate: "",
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
      response: [],
    };
  }

  componentDidMount = () => {
    axios
      .get("/companynames")
      .then((s) => {
        this.setState({ companyNames: s.data }, () => {});
      })
      .catch((e) => console.log(e));
  };

  getTopCompanies = () => {
    const days =
      this.state.selectedTimePeriod === ""
        ? 180
        : this.state.selectedTimePeriod;
    this.setState({ loading: true, selectedTimePeriod: days }, () => {
      axios
        .get("/topCompanies?days=" + days + "&rate=" + this.state.rate / 100)
        .then((s) => {
          this.setState({ response: s.data }, () => {});
          this.setState({ loading: false }, () => {
            console.log(this.state);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  };

  render() {
    const { classes } = this.props;
    const period = underscore.invert(this.state.timePeriod);
    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={3}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-filled-label">
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
          <Grid item xs={3}>
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
                  this.setState({ rate: val }, () => {
                    this.getTopCompanies();
                  });
                }
              }}
            />
          </Grid>
        </Grid>

        {this.state.loading ? (
          <Loader />
        ) : (
          this.state.selectedTimePeriod !== "" &&
          this.state.response.length !== 0 &&
          this.state.response.map((company) => {
            const link = "companydetails/" + company["company"];
            const text =
              " In the last " +
              period[company["totalNumberOfDays"]] +
              " for " +
              company["percentOfDays"] +
              " percent of trading days, growth rate for " +
              company["company"] +
              " was more than " +
              company["rate"];
            return (
              <ListItem button component={NavLink} to={link}>
                <Typography>{text}</Typography>
              </ListItem>
            );
          })
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Comparision);
