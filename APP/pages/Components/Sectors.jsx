import { TextField, withStyles, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { withRouter } from "react-router-dom";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import axios from "axios";
import React from "react";

const styles = (theme) => ({
  chart: {
    width: "75%"
  },
  divchart: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex"
  }
});

class Sectors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: JSON.parse(localStorage.getItem("sectors")) || [],
      selectedSector: "",
      selectedSectorCompanies: [],
      selectedCompany: "",
      series: JSON.parse(localStorage.getItem("series")) || [],
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
          },
          width: "100%"
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        stroke: {
          show: true,
          curve: "smooth",
          lineCap: "butt",
          colors: undefined,
          width: 0,
          dashArray: 0
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 0
        },

        title: {
          text: "Sectors Overview",
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
              return val;
            }
          },
          title: {
            text: "Number of Companies"
          }
        },
        xaxis: {
          labels: {
            rotate: -60,
            maxHeight: 150,
            trim: true,
            formatter: (val) => {
              return val;
            }
          },
          title: {
            text: "Sectors"
          }
        },

        tooltip: {
          shared: false,
          x: {
            formatter: (val) => {
              return val;
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
    console.log("Sectors");

    const sectors = JSON.parse(localStorage.getItem("sectors"));
    const series = JSON.parse(localStorage.getItem("series"));
    if (sectors != null && series != null) {
      return;
    }
    this.getSectors();
  };

  getSectors = async () => {
    await axios.get("api/sectors").then((s) => {
      if (s.status === 200) {
        this.setState({ sectors: s.data }, () => {
          localStorage.setItem("sectors", JSON.stringify(this.state.sectors));
        });
      } else {
        this.setState({ sectors: [] }, () => {});
      }
    });

    const sectors = JSON.parse(localStorage.getItem("sectors"));
    let countdata = {
      name: "Number Of Companies",
      data: []
    };
    for (const key in sectors) {
      if (Object.hasOwnProperty.call(sectors, key)) {
        const element = sectors[key];
        countdata.data.push({ x: key, y: element.length });
      }
    }
    const series = [];
    series.push(countdata);
    this.setState({ series: series }, () => {
      localStorage.setItem("series", JSON.stringify(this.state.series));
    });
  };

  selectedSector = (e, val) => {
    if (val === null) {
      this.setState(
        { selectedSector: "", selectedSectorCompanies: [] },
        () => {}
      );
    } else {
      this.setState(
        {
          selectedSector: val,
          selectedSectorCompanies: this.state.sectors[val]
        },
        () => {}
      );
    }
  };

  selectedCompany = (val) => {
    const { history } = this.props;
    if (val === null) {
      history.push("/");
    } else {
      this.setState({ selectedCompany: val }, () => {
        history.push("companydetails/" + val);
      });
    }
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
          <div className={classes.divchart}></div>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
          >
            <Grid item>
              {this.state.sectors.length !== 0 && (
                <Autocomplete
                  style={{
                    width: 400
                  }}
                  onChange={(e, val) => {
                    this.selectedSector(e, val);
                  }}
                  id="search for sector"
                  freeSolo
                  options={Object.keys(this.state.sectors).map(
                    (sector) => sector
                  )}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="search for sector"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item>
              {this.state.selectedSectorCompanies.length !== 0 && (
                <Autocomplete
                  style={{ width: 400, align: "center" }}
                  onChange={(e, val) => {
                    this.selectedCompany(val);
                  }}
                  id="search for companies"
                  freeSolo
                  options={this.state.selectedSectorCompanies.map(
                    (company) => company
                  )}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="search for company"
                      margin="normal"
                      variant="outlined"
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item style={{ width: "75%" }}>
              <Chart
                options={this.state.options}
                series={this.state.series}
                key="chart"
                type="bar"
              />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Sectors));
