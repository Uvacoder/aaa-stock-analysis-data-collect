import { Button, TextField, Typography, Grid } from "@material-ui/core";
import axios from "axios";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import validator from "validator";
import { withRouter, NavLink } from "react-router-dom";

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: JSON.parse(localStorage.getItem("email")) || "",
      password: JSON.parse(localStorage.getItem("password")) || "",
      loginstatus: "",
      emailError: "",
      passwordError: "",
    };
  }
  componentDidMount = () => {
    console.log("Login");
    window.localStorage.clear();
  };

  verifyAndLogin = () => {
    this.setState({ loginstatus: "" }, () => {});
    const { history } = this.props;
    const { email, password } = this.state;
    const prevemail = JSON.parse(localStorage.getItem("email"));
    const prevpassword = JSON.parse(localStorage.getItem("password"));
    if (prevemail == email && prevpassword == password) {
      localStorage.setItem("logged", JSON.stringify(true));
      return;
    }
    const isValidEmail = validator.isEmpty(this.state["email"]);
    const isValidPassword = validator.isEmpty(this.state["password"]);
    const emailError = isValidEmail == false ? "" : "email cannot be empty";
    const passwordError =
      isValidPassword == false ? "" : "password cannot be empty";

    this.setState(
      {
        emailError,
        passwordError,
      },
      () => {}
    );

    const isvalid = isValidEmail == false && isValidPassword == false;

    if (isvalid == false) {
      return;
    }
    axios
      .get("/api/signin?" + "email=" + email + "&" + "password=" + password)
      .then((s) => {
        if (s["data"]["status"].indexOf("success") !== -1) {
          const details = s["data"]["details"];
          localStorage.setItem("details", JSON.stringify(details));
          // localStorage.setItem(
          //   "firstName",
          //   JSON.stringify(details["firstName"])
          // );
          // localStorage.setItem("lastName", JSON.stringify(details["lastName"]));
          // localStorage.setItem("email", JSON.stringify(details["email"]));
          localStorage.setItem("logged", JSON.stringify(true));
          history.push("/");
        } else {
          this.setState({ loginstatus: s["data"]["status"] }, () => {});
          localStorage.setItem("logged", JSON.stringify(false));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    const logged = JSON.parse(localStorage.getItem("logged"));
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div
          style={{
            padding: "25px",
            textAlign: "center",
            margin: "10px",
          }}
        >
          <Typography variant="h4">{this.state.loginstatus}</Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={this.state.email}
            onChange={(e) => {
              this.setState({ email: e.target.value });
            }}
            error={this.state.emailError.length !== 0 ? true : false}
            helperText={this.state.emailError}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={this.state.password}
            onChange={(e) => {
              this.setState({ password: e.target.value });
            }}
            error={this.state.passwordError.length !== 0 ? true : false}
            helperText={this.state.passwordError}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.verifyAndLogin}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <NavLink to="/signup" variant="body2" style={{ color: "blue" }}>
                {"Don't have an account? Sign Up"}
              </NavLink>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(Login));
