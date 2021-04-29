var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const process = require("process");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var companyNamesRouter = require("./routes/companyNames");
var topCompaniesRouter = require("./routes/topCompanies");
var companyDetailsRouter = require("./routes/companydetails");
var companyStockDetailsRouter = require("./routes/stockdetails");
var previousDayCompanyStockDetailsRouter = require("./routes/previousdaystockdetails");
var sectorsRouter = require("./routes/sectors");
var sp500Router = require("./routes/sp500");
var marketActionRouter = require("./routes/marketaction");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "build")));
// app.use("/static", express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/companyNames", companyNamesRouter);
app.use("/topCompanies", topCompaniesRouter);
app.use("/companydetails", companyDetailsRouter);
app.use("/stockdetails", companyStockDetailsRouter);
app.use("/previousdaystockdetails", previousDayCompanyStockDetailsRouter);
app.use("/sectors", sectorsRouter);
app.use("/sp500", sp500Router);
app.use("/marketaction", marketActionRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });
module.exports = app;
