var express = require("express");
var router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const process = require("process");

router.get("/", function (req, res, next) {
  process.chdir("../");
  try {
    const sectors = JSON.parse(fs.readFileSync("Data/sectors.json", "utf8"));
    res.send(sectors);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
});

module.exports = router;
