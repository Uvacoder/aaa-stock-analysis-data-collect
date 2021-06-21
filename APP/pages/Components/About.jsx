import React from "react";
import { Typography, Grid, Avatar, withStyles, Link } from "@material-ui/core";
import GitHubIcon from "@material-ui/icons/GitHub";
import clsx from "clsx";

const styles = (theme) => ({
  large: {
    width: 50,
    height: 50,
  },
  color: {
    color: "#ffffff",
    backgroundColor: "#FF8C00",
  },
});
class About extends React.Component {
  componentDidMount = () => {
    console.log("About");
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div
          style={{
            padding: "25px",
            margin: "10px",
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: "#0D19A3",
            }}
            align="center"
          >
            About Us
          </Typography>
          <Typography variant="h6" align="left">
            <span style={{ backgroundColor: "#15DB95", color: "#0D19A3" }}>
              Stock Vestor
            </span>{" "}
            is a tool for investors to optimize their returns of the given
            company in midterm investments. This tool considers each stock,
            understands the trend of the stock for short and longer periods,
            evaluates volatility and risk of the stock, assesses the effect of
            market sentiment and corporate actions on the stock and advise
            investors on entry and exit of that stock.
          </Typography>
          <Typography variant="h6" align="left" style={{ marginTop: "20px" }}>
            We are a team of analytics experts who utilize their skills in both
            technology find trends and manage data.
          </Typography>
          <Typography
            variant="h4"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              color: "#0D19A3",
            }}
            align="center"
          >
            Team
          </Typography>
          <Grid
            container
            direction="column"
            spacing={3}
            justify="center"
            alignItems="center"
          >
            <Grid container item spacing={3}>
              <Grid item>
                <Avatar
                  className={clsx(classes.large, classes.color)}
                  alt="Arun Kumar Parayatham"
                  src="/images/arun.png"
                >
                  <Typography variant="h2" component="h2">
                    A
                  </Typography>
                </Avatar>
              </Grid>
              <Grid item>
                <Link href="https://github.com/aparayatham">
                  <Avatar className={clsx(classes.large)}>
                    <GitHubIcon color="disabled" fontSize="large" />
                  </Avatar>
                </Link>
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h4">
                  Arun Kumar Parayatham
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item>
                <Avatar
                  className={clsx(classes.large, classes.color)}
                  alt="Venu Gopal Jilla"
                  src="/images/venu.png"
                >
                  <Typography variant="h2" component="h2">
                    V
                  </Typography>
                </Avatar>
              </Grid>
              <Grid item>
                <Link href="https://github.com/VenuGopalJilla">
                  <Avatar className={clsx(classes.large)}>
                    <GitHubIcon color="disabled" fontSize="large" />
                  </Avatar>
                </Link>
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h4">
                  Venu Gopal Jilla
                </Typography>
              </Grid>
            </Grid>
            <Grid container item spacing={3}>
              <Grid item>
                <Avatar
                  className={clsx(classes.large, classes.color)}
                  alt="Venkata Sai Krishna Nama"
                  src="/images/sai.png"
                >
                  <Typography variant="h2" component="h2">
                    V
                  </Typography>
                </Avatar>
              </Grid>
              <Grid item>
                <Link href="https://www.github.com/saikr789">
                  <Avatar className={clsx(classes.large)}>
                    <GitHubIcon color="disabled" fontSize="large" />
                  </Avatar>
                </Link>
              </Grid>
              <Grid item>
                <Typography variant="h4" component="h4">
                  Venkata Sai Krishna Nama
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(About);
