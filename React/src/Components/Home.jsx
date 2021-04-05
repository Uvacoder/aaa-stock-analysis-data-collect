import React from "react";
import firebase from "firebase";
import { Route, Switch } from "react-router-dom";

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core/styles";

import NavigationBar from "./NavigationBar";
import Login from "./Login";
import About from "./About";
import Performance from "./Performance";
import SideBar from "./SideBar";
import Top10Sell from "./Top10Sell";
import Top10Buy from "./Top10Buy";
import Top30Buy from "./Top30Buy";
import Top30Sell from "./Top30Sell";
import Sectors from "./Sectors";
import Dashboard from "./Dashboard";
import CompanyDetails from "./CompanyDetails";
import Revenue from "./Revenue";
import PageNotFound from "./PageNotFound";
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
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
});

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyNames: [],
      selectedCompany: "",
      companyDetails: {},
      // selectedCompanyDetails: [],
    };
  }

  getCompanyDetailsFromFirebase = () => {
    const dbref = firebase.database().ref();
    dbref.child("companies").on(
      "value",
      (snap) => {
        this.setState({ companyNames: Object.keys(snap.val()) }, () => {});
        this.setState({ companyDetails: snap.val() }, () => {});
      },
      (err) => {
        console.log(err);
      }
    );
  };

  getSelectedCompany = (company) => {
    if (company === null) {
      this.setState({ selectedCompany: "" }, () => {});
      return;
    }
    this.setState({ selectedCompany: company }, () => {});
  };

  // getSelectedCompanyDetails = (company) => {
  //   this.setState(
  //     { selectedCompanyDetails: this.state.companyDetails[company] },
  //     () => {}
  //   );
  // };

  componentDidMount = () => {
    console.log("Home");
    this.getCompanyDetailsFromFirebase();
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
              {this.state.companyNames.length !== 0 && (
                <NavigationBar
                  styles ={{margin :"10px"}}
                  searchforcompanies={this.state.companyNames}
                  onSelectCompany={this.getSelectedCompany}
                />
              )}
            </Toolbar>
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
            {this.state.selectedCompany !== "" && (
              <CompanyDetails selectedCompany={this.state.selectedCompany} />
            )}
            <Switch>
              <Route exact path="/" />
              <Route exact path="/login" component={Login} />
              <Route exact path="/about" component={About} />
              <Route exact path="/performance" component={Performance} />
              <Route
                exact
                path="/top/10/sell"
                component={() => (
                  <Top10Sell companyNames={this.state.companyNames} />
                )}
              />
              <Route
                exact
                path="/top/10/buy"
                component={() => (
                  <Top10Buy companyNames={this.state.companyNames} />
                )}
              />
              <Route
                exact
                path="/top/30/buy"
                component={() => (
                  <Top30Buy companyNames={this.state.companyNames} />
                )}
              />
              <Route
                exact
                path="/top/30/sell"
                component={() => (
                  <Top30Sell companyNames={this.state.companyNames} />
                )}
              />
              <Route exact path="/sectors" component={Sectors} />
              <Route
                exact
                path="/companydetails/:company"
                component={CompanyDetails}
              />
              <Route
                exact
                path="/revenue"
                component={() => (
                  <Revenue companyNames={this.state.companyNames} />
                )}
              />
              <Route component={PageNotFound} />
            </Switch>
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Home);
