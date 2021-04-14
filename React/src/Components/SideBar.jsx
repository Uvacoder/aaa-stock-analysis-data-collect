import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  withStyles,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { NavLink } from "react-router-dom";
const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  link: {
    textDecoration: "none",
  },
  paper: {
    display: "flex",
    "& > *": {
      padding: theme.spacing(2),
      // margin: theme.spacing(1),
      width: "100%",
      height: "100%",
    },
  },
});

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    console.log("Sidebar");
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Paper className={classes.paper} elevation={0}>
          <Accordion style={{ border: "none" }}>
            <AccordionSummary aria-controls="panel1a-content" id="top10">
              <Typography variant="h4">TOP 10</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NavLink
                to={{ pathname: "/top/10/buy" }}
                className={classes.link}
              >
                <Paper className={classes.paper} elevation={0}>
                  <Typography variant="h6">BUY</Typography>
                </Paper>
              </NavLink>
            </AccordionDetails>
            <AccordionDetails>
              <NavLink
                to={{ pathname: "/top/10/sell" }}
                className={classes.link}
              >
                <Paper className={classes.paper} elevation={0}>
                  <Typography variant="h6">SELL</Typography>
                </Paper>
              </NavLink>
            </AccordionDetails>
          </Accordion>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <Accordion>
            <AccordionSummary aria-controls="panel1a-content">
              <Typography variant="h4">TOP 30</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <NavLink
                to={{ pathname: "/top/30/buy" }}
                className={classes.link}
              >
                <Paper className={classes.paper} elevation={0}>
                  <Typography variant="h6">BUY</Typography>
                </Paper>
              </NavLink>
            </AccordionDetails>
            <AccordionDetails>
              <NavLink
                to={{ pathname: "/top/30/sell" }}
                className={classes.link}
              >
                <Paper className={classes.paper} elevation={0}>
                  <Typography variant="h6">SELL</Typography>
                </Paper>
              </NavLink>
            </AccordionDetails>
          </Accordion>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <NavLink to={{ pathname: "/sectors" }} className={classes.link}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h4">Sectors</Typography>
            </Paper>
          </NavLink>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <NavLink to={{ pathname: "/sp500" }} className={classes.link}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h4">S AND P 500</Typography>
            </Paper>
          </NavLink>
        </Paper>
        <Paper className={classes.paper} elevation={0}>
          <NavLink to={{ pathname: "/revenue" }} className={classes.link}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h4">TOP REVENUE</Typography>
            </Paper>
          </NavLink>
        </Paper>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(SideBar);
