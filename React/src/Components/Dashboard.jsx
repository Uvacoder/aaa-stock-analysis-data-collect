import React from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import { ButtonGroup, Button, Divider } from "@material-ui/core";
import Loader from "react-loader-spinner";
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      details: [],
      selectedPeriod: "",
      company: "",
      error: false,
      series: [],
      options: {
        chart: {
          background: "#ffffff",
          type: "area",
          height: "auto",
          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true,
          },
          toolbar: {
            autoSelected: "zoom",
          },
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        title: {
          text: "Stock Price Movement",
          align: "left",
          style: {
            fontSize: "24px",
            fontWeight: "bold",
            fontFamily: undefined,
            color: "blue",
            display: "flex",
            justifyContent: "center",
          },
        },
        fill: {
          type: "solid",
          opacity: 0.9,
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 90, 100],
          },
        },
        yaxis: {
          labels: {
            formatter: (val) => {
              return val.toFixed();
            },
          },
          title: {
            text: "Price in Rs",
          },
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
            },
          },
          title: {
            text: "Time Period",
          },
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
            },
          },
          y: {
            formatter: (val) => {
              return val;
            },
          },
        },
      },
    };
  }

  componentDidMount = () => {
    console.log("Dashboard");
    if (this.props.company !== "sp500") {
      this.setState({ company: this.props.company }, () => {
        axios
          .get("/stockdetails?company=" + this.state.company)
          .then((s) => {
            if (s.status === 200) {
              this.setState({ details: s.data, loading: false }, () => {});
            } else {
              this.setState({ details: [], loading: false }, () => {});
            }
          })
          .then(() => {})
          .catch((e) => {
            console.log(e);
            this.setState({ loading: false, error: true }, () => {});
          });
      });
    } else {
      this.setState({ company: this.props.company }, () => {
        axios
          .get("/sp500")
          .then((s) => {
            if (s.status === 200) {
              this.setState({ details: s.data, loading: false }, () => {});
            } else {
              this.setState({ details: [], loading: false }, () => {});
            }
          })
          .then(() => {})
          .catch((e) => {});
      });
    }
  };

  createGraph = (days) => {
    let closePriceData = {
      name: "Close Price",
      data: [],
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
      closePriceData.data.push({
        x: element["Date"],
        y: element["Close Price"] || element["Close"],
      });
    }
    let options = this.state.options;
    options.xaxis["min"] = fromDate;
    options.xaxis["max"] = toDate;
    const series = [];
    series.push(closePriceData);
    this.setState(
      {
        series: series,
        options: options,
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
    return (
      <React.Fragment>
        {this.state.loading ? (
          <Loader />
        ) : (
          this.state.error !== true && (
            <div>
              <Divider />
              <Divider />
              <Divider />
              <ButtonGroup
                color="primary"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "10px",
                }}
              >
                <Button value="7" onClick={this.selectedPeriod}>
                  7D
                </Button>
                <Button value="30" onClick={this.selectedPeriod}>
                  1M
                </Button>
                <Button value="90" onClick={this.selectedPeriod}>
                  3M
                </Button>
                <Button value="180" onClick={this.selectedPeriod}>
                  6M
                </Button>
                <Button value="360" onClick={this.selectedPeriod}>
                  1Y
                </Button>
                <Button value="1800" onClick={this.selectedPeriod}>
                  5Y
                </Button>
                <Button value="all" onClick={this.selectedPeriod}>
                  All
                </Button>
              </ButtonGroup>
              <Chart options={this.state.options} series={this.state.series} />
            </div>
          )
        )}
      </React.Fragment>
    );
  }
}

export default Dashboard;
