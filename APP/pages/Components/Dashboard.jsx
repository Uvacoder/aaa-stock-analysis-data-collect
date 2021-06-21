import React from "react";
import axios from "axios";
// import Chart from "react-apexcharts";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { ButtonGroup, Button, Divider, withStyles } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import moment from "moment";

import Loader from "react-loader-spinner";

const styles = (theme) => ({
  chart: {
    width: "75%"
  },
  divchart: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  },
  buttongroup: {
    display: "flex",
    justifyContent: "center",
    margin: "10px"
  },
  button: {
    "&:hover": {
      backgroundColor: "red",
      color: "#ffffff"
    }
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      details: JSON.parse(localStorage.getItem("details")) || [],
      sp500ChartDetails:
        JSON.parse(localStorage.getItem("sp500ChartDetails")) || [],
      stockChartDetails:
        JSON.parse(localStorage.getItem("stockChartDetails")) || [],
      selectedPeriod: "",
      company: JSON.parse(localStorage.getItem("company")) || "",
      error: false,
      series: [],
      options: {
        chart: {
          background: "inherit",
          type: "area",
          height: "auto",
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
            autoSelected: "zoom"
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },
        title: {
          text: "Stock Price Movement",
          align: "center",
          style: {
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: undefined,
            color: "blue",
            display: "flex",
            justifyContent: "center"
          }
        },
        fill: {
          type: "solid",
          opacity: 0.9,
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 90, 100]
          }
        },
        yaxis: {
          labels: {
            formatter: (val) => {
              return val.toFixed();
            }
          },
          title: {
            text: "Price in Rs"
          }
        },
        xaxis: {
          type: "datetime",
          labels: {
            formatter: (val) => {
              const dt = new Date(val);
              return (
                dt.getDate() +
                "-" +
                (dt.getMonth() + 1) +
                "-" +
                dt.getFullYear()
              );
            }
          },
          title: {
            text: "Time Period"
          }
        },

        tooltip: {
          shared: false,
          x: {
            formatter: (val) => {
              const dt = new Date(val);
              return (
                dt.getDate() +
                "-" +
                (dt.getMonth() + 1) +
                "-" +
                dt.getFullYear()
              );
            }
          },
          y: {
            formatter: (val) => {
              return val;
            }
          }
        }
      }
    };
  }

  componentDidMount = () => {
    console.log("Dashboard");
    const { match } = this.props;
    let company = "";
    if ("company" in match.params) {
      company = match.params.company;
    } else {
      company = this.props.company;
    }
    const prevcompany = JSON.parse(localStorage.getItem("company"));
    const curdate = moment().format("DD-MM-YYYY");
    const prevdate =
      localStorage.getItem("date") == null
        ? curdate
        : localStorage.getItem("date");
    if (
      prevcompany != null &&
      company !== "sp500" &&
      company === prevcompany &&
      prevdate == curdate &&
      this.state.stockChartDetails.length != 0
    ) {
      this.setState({ details: this.state.stockChartDetails }, () => {});
      return;
    }

    if (
      company === "sp500" &&
      prevdate == curdate &&
      this.state.sp500ChartDetails.length != 0
    ) {
      this.setState({ details: this.state.sp500ChartDetails }, () => {});
      return;
    }

    this.setState({ company: company }, () => {
      localStorage.setItem("company", JSON.stringify(this.state.company));
      this.getDetails(company);
    });
  };

  getDetails = async (company) => {
    this.setState({ loading: true }, () => {});
    if (company !== "sp500") {
      await axios
        .get("/api/stockdetails?company=" + company)
        .then((s) => {
          if (s.status === 200) {
            this.setState({ stockChartDetails: s.data, loading: false }, () => {
              localStorage.setItem(
                "stockChartDetails",
                JSON.stringify(this.state.stockChartDetails)
              );
            });
          } else {
            this.setState({ details: [], loading: false }, () => {});
          }
        })
        .then(() => {})
        .catch((e) => {
          console.log(e);
          this.setState({ loading: false, error: true }, () => {});
        });
    } else {
      this.setState({ sp500: true }, () => {});
      await axios
        .get("/api/sp500")
        .then((s) => {
          if (s.status === 200) {
            this.setState({ sp500ChartDetails: s.data, loading: false }, () => {
              localStorage.setItem(
                "sp500ChartDetails",
                JSON.stringify(this.state.sp500ChartDetails)
              );
            });
          } else {
            this.setState({ details: [], loading: false }, () => {});
          }
        })
        .catch((e) => {
          console.log(e);
          this.setState({ loading: false, error: true }, () => {});
        });
    }

    if (company == "sp500") {
      this.setState({ details: this.state.sp500ChartDetails }, () => {});
    } else {
      this.setState({ details: this.state.stockChartDetails }, () => {});
    }
  };

  createGraph = (days) => {
    let openPriceData = {
      name: "Open Price",
      data: []
    };

    let lowPriceData = {
      name: "Low Price",
      data: []
    };

    let highPriceData = {
      name: "High Price",
      data: []
    };

    let closePriceData = {
      name: "Close Price",
      data: []
    };

    days =
      days === "all"
        ? this.state.details.length - 1
        : days > this.state.details.length - 1
        ? this.state.details.length - 1
        : days;
    const toDate = this.state.details[0]["Date"];
    const fromDate = this.state.details[days]["Date"];
    const data = this.state.details.slice(0, days);
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      openPriceData.data.push({
        x: element["Date"],
        y: element["Open Price"] || element["Open"]
      });

      lowPriceData.data.push({
        x: element["Date"],
        y: element["Low Price"] || element["Low"]
      });

      highPriceData.data.push({
        x: element["Date"],
        y: element["High Price"] || element["High"]
      });

      closePriceData.data.push({
        x: element["Date"],
        y: element["Close Price"] || element["Close"]
      });
    }
    let options = this.state.options;
    options.xaxis["min"] = fromDate;
    options.xaxis["max"] = toDate;
    const series = [];
    series.push(openPriceData);
    series.push(lowPriceData);
    series.push(highPriceData);
    series.push(closePriceData);

    this.setState(
      {
        series: series,
        options: options
      },
      () => {}
    );
  };

  selectedPeriod = (e) => {
    const days = e.currentTarget.value;
    if (this.state.selectedPeriod === days) {
      return;
    }
    this.setState({ selectedPeriod: days }, () => {
      this.createGraph(days);
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Loader style={{ paddingLeft: "50%" }} />
        ) : (
          this.state.error !== true && (
            <div>
              <Divider />
              <Divider />
              <Divider />
              <ButtonGroup color="primary" className={classes.buttongroup}>
                <Button
                  key="7"
                  value="7"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 7 ? "green" : "",
                    color: this.state.selectedPeriod == 7 ? "white" : ""
                  }}
                  selected
                >
                  7D
                </Button>
                <Button
                  key="30"
                  value="30"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 30 ? "green" : "",
                    color: this.state.selectedPeriod == 30 ? "white" : ""
                  }}
                >
                  1M
                </Button>
                <Button
                  key="90"
                  value="90"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 90 ? "green" : "",
                    color: this.state.selectedPeriod == 90 ? "white" : ""
                  }}
                >
                  3M
                </Button>
                <Button
                  key="180"
                  value="180"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 180 ? "green" : "",
                    color: this.state.selectedPeriod == 180 ? "white" : ""
                  }}
                >
                  6M
                </Button>
                <Button
                  key="360"
                  value="360"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 360 ? "green" : "",
                    color: this.state.selectedPeriod == 360 ? "white" : ""
                  }}
                >
                  1Y
                </Button>
                <Button
                  key="1800"
                  value="1800"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == 1800 ? "green" : "",
                    color: this.state.selectedPeriod == 1800 ? "white" : ""
                  }}
                >
                  5Y
                </Button>
                <Button
                  key="all"
                  value="all"
                  className={classes.button}
                  onClick={this.selectedPeriod}
                  style={{
                    backgroundColor:
                      this.state.selectedPeriod == "all" ? "green" : "",
                    color: this.state.selectedPeriod == "all" ? "white" : ""
                  }}
                >
                  All
                </Button>
              </ButtonGroup>
              <div className={classes.divchart}>
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  key="chart"
                  className={classes.chart}
                />
              </div>
            </div>
          )
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Dashboard));
