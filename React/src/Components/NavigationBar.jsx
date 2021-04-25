import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import axios from "axios";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  link: {
    textDecoration: "none",
  },
  grid: {
    padding: 20,
  },
});

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCompany: " ", companyNames: [] };
  }

  selectedCompany = (e, val) => {
    const { history } = this.props;
    if (val === null) {
      history.push("/");
      return;
    }
    this.setState({ selectedCompany: val }, () => {
      history.push("/companydetails/" + this.state.selectedCompany);
    });
  };

  componentDidMount = () => {
    console.log("NavigationBar");
    axios
      .get("/companyNames")
      .then((s) => {
        if (s.status === 200) {
          this.setState({ companyNames: s.data });
        } else {
          this.setState({ companyNames: [] });
        }
      })
      .catch((e) => console.log(e));
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.root} spacing={2}>
        <Grid item>
          <NavLink to="/" className={classes.link}>
            <Typography className={classes.grid} variant="h4">
              Home
            </Typography>
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink to="/about" className={classes.link}>
            <Typography className={classes.grid} variant="h4">
              About
            </Typography>
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink to="/performance" className={classes.link}>
            <Typography className={classes.grid} variant="h4">
              Performance
            </Typography>
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink to="/login" className={classes.link}>
            <Typography className={classes.grid} variant="h4">
              Login
            </Typography>
          </NavLink>
        </Grid>
        <Grid item>
          <NavLink to="/comparision" className={classes.link}>
            <Typography className={classes.grid} variant="h4">
              Comparision
            </Typography>
          </NavLink>
        </Grid>
        <Grid item>
          <Autocomplete
            style={{ width: "200px" }}
            value={this.state.selectedCompany}
            onChange={(e, val) => {
              this.selectedCompany(e, val);
            }}
            id="search for companies"
            freeSolo
            options={this.state.companyNames.map((companyname) => companyname)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="search for companies"
                margin="normal"
                variant="outlined"
              />
            )}
          />
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(withRouter(NavigationBar));
