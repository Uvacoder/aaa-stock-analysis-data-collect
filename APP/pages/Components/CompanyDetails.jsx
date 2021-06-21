import {
  Divider,
  Grid,
  Paper,
  Typography,
  withStyles,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Tooltip,
  Button
} from "@material-ui/core";
import React from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import moment from "moment";

import Dashboard from "./Dashboard";

const styles = (theme) => ({
  paper: {
    display: "flex",
    padding: "15px",
    margin: "15px",
    justifyContent: "center"
  },
  tooltip: {
    // backgroundColor: "#15DB95",
    backgroundColor: "#f0f0f0",
    color: "#000000",
    maxWidth: "none"
  },
  allitems: {
    "&:hover": {
      backgroundColor: "#15DB95",
      color: "#0D19A3"
    }
  },
  chip: { margin: "5px", backgroundColor: "#ffffff", color: "#5F00E7" }
});

class CompanyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyDetails: JSON.parse(localStorage.getItem("companyDetails")) || [],
      companyCurrentDayStockDetails:
        JSON.parse(localStorage.getItem("companyCurrentDayStockDetails")) || [],
      selectedCompany:
        JSON.parse(localStorage.getItem("selectedCompany")) || "",
      companydetailsloading: false,
      stockdetailsloading: false,
      suggest: JSON.parse(localStorage.getItem("suggest")) || "",
      necessarykeys: [
        "Date",
        "Open Price",
        "High Price",
        "Low Price",
        "Close Price"
      ],
      otherkeys: [
        "WAP",
        "No.of Shares",
        "No. of Trades",
        "Total Turnover (Rs.)",
        "% Deli. Qty to Traded Qty",
        "Spread High-Low",
        "Spread Close-Open"
      ],
      stockdetails: JSON.parse(localStorage.getItem("stockdetails")) || []
    };
  }

  componentDidMount = () => {
    console.log("CompanyDetails");
    const { match } = this.props;
    const company = match.params.company;
    const prevcompany = JSON.parse(localStorage.getItem("selectedCompany"));
    const curdate = moment().format("DD-MM-YYYY");
    const prevdate =
      localStorage.getItem("date") == null
        ? curdate
        : localStorage.getItem("date");

    if (prevcompany === company && prevdate === curdate) {
      return;
    }

    this.setState({ selectedCompany: company }, () => {
      localStorage.setItem(
        "selectedCompany",
        JSON.stringify(this.state.selectedCompany)
      );
      this.getDetails(this.state.selectedCompany);
    });
  };

  getDetails = async (company) => {
    this.getCompanyDetails(company);
    this.getStockDetails(company);
    this.getSuggestion(company);
  };

  getCompanyDetails = async (company) => {
    this.setState({ companydetailsloading: true }, () => {});
    await axios
      .get("/api/companydetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          let companyDetails = s.data;

          this.setState(
            { companyDetails: companyDetails, companydetailsloading: false },
            () => {
              localStorage.setItem(
                "companyDetails",
                JSON.stringify(this.state.companyDetails)
              );
            }
          );
        } else {
          this.setState(
            { companyDetails: [], companydetailsloading: false },
            () => {}
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState(
          { companyDetails: [], companydetailsloading: false },
          () => {}
        );
      });
  };

  getStockDetails = async (company) => {
    this.setState({ stockdetailsloading: true }, () => {});
    await axios
      .get("/api/previousdaystockdetails?company=" + company)
      .then((s) => {
        if (s.status === 200) {
          this.setState(
            { stockdetails: s.data, stockdetailsloading: false },
            () => {
              localStorage.setItem(
                "stockdetails",
                JSON.stringify(this.state.stockdetails)
              );
            }
          );
        } else {
          this.setState(
            { stockdetails: [], stockdetailsloading: false },
            () => {}
          );
        }
      })
      .catch((e) => {
        console.log(e);
        this.setState(
          { stockdetails: [], stockdetailsloading: false },
          () => {}
        );
      });
  };

  getSuggestion = async (company) => {
    await axios
      .get("/api/suggest?company=" + company)
      .then((t) => {
        if (t.status === 200) {
          let suggest = t.data["suggest"];
          if (suggest.length === 0) {
            suggest = "hold";
          }
          this.setState({ suggest: suggest }, () => {
            localStorage.setItem("suggest", JSON.stringify(this.state.suggest));
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div
          style={{
            padding: "25px"
          }}
        >
          {this.state.selectedCompany !== "" && (
            <div>
              <Paper elevation={3} className={classes.paper}>
                <Typography variant="h4">
                  {this.state.selectedCompany}
                </Typography>
              </Paper>
              <Divider />
              {this.state.companydetailsloading === true ? (
                <Loader style={{ paddingLeft: "50%" }} />
              ) : (
                <Grid
                  container
                  spacing={3}
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          {Object.keys(this.state.companyDetails).map((key) => {
                            if (this.state.companyDetails[key] === null) {
                              return <span key={key.toString()}></span>;
                            }
                            return (
                              <TableRow className={classes.allitems}>
                                <TableCell>{key}</TableCell>
                                <TableCell align="right">
                                  {this.state.companyDetails[key]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Typography variant="h4">SUGGESTION</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{
                                background:
                                  this.state.suggest == "sell" ? "green" : "red"
                              }}
                            >
                              <Typography variant="h4">SELL</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{
                                background:
                                  this.state.suggest == "buy" ? "green" : "red"
                              }}
                            >
                              <Typography variant="h4">BUY</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              style={{
                                background:
                                  this.state.suggest == "hold" ? "green" : "red"
                              }}
                            >
                              <Typography variant="h4">HOLD</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item>
                    {this.state.stockdetailsloading == true ||
                    this.state.stockdetails.length == 0 ? (
                      <Loader style={{ paddingLeft: "50%" }} />
                    ) : (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableBody>
                            {this.state.necessarykeys.map((key) => {
                              return (
                                <TableRow className={classes.allitems}>
                                  <TableCell>{key}</TableCell>
                                  <TableCell align="right">
                                    {this.state.stockdetails[key]}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <Tooltip
                      classes={{ tooltip: classes.tooltip }}
                      placement="bottom"
                      title={
                        <TableRow>
                          {this.state.otherkeys.map((key) => {
                            return (
                              <TableRow>
                                <TableCell>{key}</TableCell>
                                <TableCell align="right">
                                  {this.state.stockdetails[key]}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableRow>
                      }
                      interactive
                    >
                      <Button variant="contained" color="primary">
                        more details
                      </Button>
                    </Tooltip>
                  </Grid>
                </Grid>
              )}
            </div>
          )}

          {this.state.selectedCompany !== "" &&
            this.state.stockdetails.length !== 0 && (
              <Dashboard company={this.state.selectedCompany} key="dashboard" />
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(CompanyDetails);
