import React from "react";
import firebase from "firebase";
import {  TextField  } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

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
    this.getSectorDetailsFromFirebase();
  };

  selectedSector = (val) => {
    this.setState({ selectedSector: val }, () => {});
    this.setState(
      { selectedSectorCompanies: this.state.sectors[val] },
      () => {}
    );
  };

  selectedCompany = (val) => {
    const { match, location, history } = this.props;
    this.setState({ selectedCompany: val }, () => {});
    let company = val.replace(/[#$.\.]/g, "");

    history.push("companydetails/" + company);
  };

  getSectorDetailsFromFirebase = () => {
    console.log("getAllCompanyStockDetailsFromFirebase");
    const dbref = firebase.database().ref();
    dbref.child("sectors").on(
      "value",
      (snap) => {
        if (snap.val() === null) {
        } else {
          this.setState({ sectors: snap.val() }, () => {});
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.sectors.length !== 0 && (
          <Autocomplete
            style={{ width: "50%", align: "center" }}
            onChange={(e, val) => {
              this.selectedSector(val);
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
