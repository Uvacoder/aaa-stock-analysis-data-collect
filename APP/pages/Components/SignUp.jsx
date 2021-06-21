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

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      firstNameError: "",
      lastNameError: "",
      emailError: "",
      passwordError: "",
      signupstatus: "",
    };
  }
  componentDidMount = () => {
    window.localStorage.clear();
    console.log("Sign Up");
  };

  verifyAndCreate = () => {
    this.setState({ signupstatus: "" }, () => {});
    const isValidFirstName = validator.isAlpha(this.state["firstName"]);
    const isValidLastName = validator.isAlpha(this.state["lastName"]);
    const isValidEmail = validator.isEmail(this.state["email"]);
    const isValidPassword = validator.isStrongPassword(this.state["password"]);

    const firstNameError =
      isValidFirstName == true ? "" : "only alphabets allowed";
    const lastNameError =
      isValidLastName == true ? "" : "only alphabets allowed";
    const emailError = isValidEmail == true ? "" : "invalid email";
    const passwordError =
      isValidPassword == true
        ? ""
        : "minLength=8, minLowercase=1, minUppercase=1, minNumbers=1, minSymbols=1";
    this.setState(
      {
        firstNameError,
        lastNameError,
        emailError,
        passwordError,
      },
      () => {}
    );

    const isvalid =
      isValidFirstName &&
      isValidLastName &&
      isValidEmail &&
      isValidPassword &&
      true;

    if (isvalid == false) {
      return;
    }
    const { email, password, firstName, lastName } = this.state;
    const prevemail = JSON.parse(localStorage.getItem("email"));
    const prevpassword = JSON.parse(localStorage.getItem("password"));
    if (prevemail == email && prevpassword == password) {
      localStorage.setItem("logged", JSON.stringify(true));
      return;
    }
    let params =
      "email=" +
      this.state.email +
      "&" +
      "password=" +
      this.state.password +
      "&" +
      "firstName=" +
      this.state.firstName +
      "&" +
      "lastName=" +
      this.state.lastName;

    axios
      .get("/api/signup?" + params)
      .then((s) => {
        this.setState(
          {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            signupstatus: s.data["status"],
          },
          () => {}
        );
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
          <Typography component="h1" variant="h4">
            {this.state.signupstatus}
          </Typography>

          <Grid container spacing={2} style={{ marginTop: "25px" }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={this.state.firstName}
                onChange={(e) => {
                  this.setState({ firstName: e.target.value });
                }}
                error={this.state.firstNameError.length !== 0 ? true : false}
                helperText={this.state.firstNameError}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={this.state.lastName}
                onChange={(e) => {
                  this.setState({ lastName: e.target.value });
                }}
                error={this.state.lastNameError.length !== 0 ? true : false}
                helperText={this.state.lastNameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={this.state.email}
                onChange={(e) => {
                  this.setState({ email: e.target.value });
                }}
                error={this.state.emailError.length !== 0 ? true : false}
                helperText={this.state.emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.verifyAndCreate}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <NavLink to="/login" style={{ color: "blue" }}>
                Already have an account? Sign in
              </NavLink>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withRouter(SignUp));
