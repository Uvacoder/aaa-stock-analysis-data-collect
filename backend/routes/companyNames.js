var express = require("express");
var router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
var path = require("path");
const process = require("process");

router.get("/", function (req, res, next) {
  process.chdir("../");
  console.log(process.cwd());
  try {
    const companywithid = JSON.parse(
      fs.readFileSync("Data/companywithid.json", "utf8")
    );
    const companyNames = Object.keys(companywithid);
    res.send(companyNames);
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
});

module.exports = router;
