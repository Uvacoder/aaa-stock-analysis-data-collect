import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import About from "./About";
import CompanyDetails from "./CompanyDetails";
import Comparision from "./Comparision";
import Login from "./Login";
import NavigationBar from "./NavigationBar";
import PageNotFound from "./PageNotFound";
import Performance from "./Performance";
import Revenue from "./Revenue";
import Sectors from "./Sectors";
import SideBar from "./SideBar";
import SP500 from "./SP500";
import { Divider } from "@material-ui/core";
import Top from "./Top";
const drawerWidth = 250;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    ...theme.mixins.toolbar,
  },
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    flexWrap: "wrap",
    padding: theme.spacing(3),
    minWidth: "480px",
    width: "auto",
    height: "100%",
    overflowX: "hidden",
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyNames: [],
    };
  }

  componentDidMount = () => {
    console.log("Home");
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classes.appBar}
            style={{ backgroundColor: "inherit" }}
          >
            <Toolbar>
              <NavigationBar />
            </Toolbar>
            <Divider />
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <div className={classes.toolbar} />
            <SideBar />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            <Divider />
            <Divider />
            <Divider />
            <Switch>
              <Route exact path="/" />
              <Route exact path="/login" component={Login} />
              <Route exact path="/about" component={About} />
              <Route exact path="/performance" component={Performance} />
              <Route
                exact
                path="/top/:num/:type"
                render={(props) => {
                  const {
                    match: {
                      params: { num, type },
                    },
                  } = props;
                  return <Top key={`num=${num}&type=${type}`} {...props} />;
                }}
              />
              <Route exact path="/sectors" component={Sectors} />
              <Route
                exact
                path="/companydetails/:company"
                render={(props) => {
                  const {
                    match: {
                      params: { company },
                    },
                  } = props;
                  return (
                    <CompanyDetails key={`company=${company}`} {...props} />
                  );
                }}
              />
              <Route
                exact
                path="/revenue"
                component={() => (
                  <Revenue companyNames={this.state.companyNames} />
                )}
              />
              <Route exact path="/sp500" component={SP500} />
              <Route exact path="/comparision" component={Comparision} />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Home));
