var express = require("express");
var router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const process = require("process");
var path = require("path");

router.get("/", function (req, res, next) {
  console.log(req.url);
  const company = req.query["company"];
  try {
    const companies = JSON.parse(
      fs.readFileSync("Data/companies.json", "utf8")
    );
    if (company === undefined) {
      res.send(companies);
    } else {
      res.send(companies[company]);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
});

module.exports = router;
