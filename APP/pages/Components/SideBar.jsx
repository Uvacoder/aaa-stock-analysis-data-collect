import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  withStyles,
  Typography,
} from "@material-ui/core";
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
    backgroundColor: "#15DB95",
    color: "#0D19A3",
  },

  accordion: {
    border: "none",
    backgroundColor: "#15DB95",
    color: "#0D19A3",
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
        <div style={{ backgroundColor: "#15DB95", height: "100%" }}>
          <Paper className={classes.paper} elevation={0}>
            <Accordion className={classes.accordion}>
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
            <Accordion className={classes.accordion}>
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
          <Paper elevation={0} className={classes.paper}>
            <NavLink to={{ pathname: "/sectors" }} className={classes.link}>
              <Paper elevation={0} className={classes.paper}>
                <Typography variant="h4">SECTORS</Typography>
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
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(SideBar);
