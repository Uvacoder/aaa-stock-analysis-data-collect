import { TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { NavLink } from "react-router-dom";

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedCompany: "" };
  }

  selectedCompany = (val) => {
    this.setState({ selectedCompany: val }, () => {});
  };

  componentDidMount = () => {
    console.log("Search");
  };

  render() {
    const ref = (
      <Autocomplete
        onChange={(e, val) => {
          this.selectedCompany(val);
        }}
        onInputChange={(e, val) => {
          this.selectedCompany(val);
        }}
        id="search for companies"
        freeSolo
        options={this.props.searchforcompanies.map(
          (companyname) => companyname
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="search for companies"
            margin="normal"
            variant="outlined"
          />
        )}
      />
    );
    if (this.state.selectedCompany !== "") {
      var to = "compantdetails/" + this.state.selectedCompany !== "";
    }
    return (
      <React.Fragment>
        {this.state.selectedCompany === "" && ref}

        {this.state.selectedCompany !== "" && (
          <NavLink to={to}>
            <Typography variant="h4">Login</Typography>
          </NavLink>
        )}
      </React.Fragment>
    );
  }
}
export default Search;
