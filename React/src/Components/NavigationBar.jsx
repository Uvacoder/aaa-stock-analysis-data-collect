import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { NavLink } from "react-router-dom";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  link: {
    textDecoration: "none",
  },
  grid: {
    paddingTop: 22,
  },
});

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCompany: "" };
  }

  selectedCompany = (e, val) => {
    // this.setState({ selectedCompany: val }, () => {});
    return this.props.onSelectCompany(val);
  };

  componentDidMount = () => {
    console.log("NavigationBar");
    this.forceUpdate();
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={2}>
          <Typography
            className={classes.grid}
            variant="h4"
            style={{ color: "#000000" }}
          >
            Stock Trends
          </Typography>
        </Grid>
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
        <Grid item xs={3}>
          <Autocomplete
            value={this.state.selectedCompany}
            onChange={(e, val) => {
              this.selectedCompany(e, val);
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
        </Grid>
      </Grid>
    );
  }
}
export default withStyles(styles)(NavigationBar);
