import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import React from "react";

class Sectors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [],
      selectedSector: "",
      selectedSectorCompanies: [],
      selectedCompany: "",
    };
  }

  componentDidMount = () => {
    console.log("Sectors");
    const { history, location } = this.props;
    if ("state" in location && location.state === undefined) {
      history.push("/");
    }

    axios.get("/sectors").then((s) => {
      if (s.status === 200) {
        this.setState({ sectors: s.data }, () => {});
      } else {
        this.setState({ sectors: [] }, () => {});
      }
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
          selectedSectorCompanies: this.state.sectors[val],
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
    return (
      <React.Fragment>
        {this.state.sectors.length !== 0 && (
          <Autocomplete
            style={{ width: "50%", align: "center" }}
            onChange={(e, val) => {
              this.selectedSector(e, val);
            }}
            id="search for sector"
            freeSolo
            options={Object.keys(this.state.sectors).map((sector) => sector)}
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
        {this.state.selectedSectorCompanies.length !== 0 && (
          <Autocomplete
            style={{ width: "50%", align: "center" }}
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
      </React.Fragment>
    );
  }
}

export default Sectors;
