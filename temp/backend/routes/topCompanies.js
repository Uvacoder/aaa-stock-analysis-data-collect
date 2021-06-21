const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const process = require("process");
const underscore = require("underscore");

router.get("/", async function (req, res, next) {
  console.log(req.url);
  const query = req.query;
  const days = parseInt(query["days"]);
  const rate = parseFloat(query["rate"]);
  let company = query["company"];
  if (company === undefined) {
    try {
      await readAndCompute(days, rate)
        .then((s) => {
          s.sort((a, b) => {
            return b["numberOfDays"] - a["numberOfDays"];
          });
          res.send(s);
        })
        .catch((e) => {
          console.log(e);
          res.status(404).send({ error: "error" });
        });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: "error" });
    }
  } else {
    try {
      company = company.toUpperCase();
      var companywithid = JSON.parse(
        fs.readFileSync("Data/companywithid.json", "utf8")
      );
      const filename = "gr" + companywithid[company] + ".csv";

      await computeForSingleCompany(filename, company, days, rate)
        .then((s) => {
          res.send(s);
        })
        .catch((e) => {
          console.log(e);

          res.status(404).send({ error: "error" });
        });
    } catch (error) {
      console.log(error);
      res.status(404).send({ error: "error" });
    }
  }
});

const readAndCompute = async function (days, rate) {
  var companywithid = JSON.parse(
    fs.readFileSync("Data/companywithid.json", "utf8")
  );

  companywithid = underscore.invert(companywithid);

  return new Promise((resolve, reject) => {
    let data = [];

    try {
      fs.readdir("Data/GRStock", async (error, files) => {
        for (let index = 0; index < files.length; index++) {
          const element = files[index];
          try {
            await compute(
              element,
              companywithid[element.slice(2, 8)],
              days,
              rate
            )
              .then((s) => data.push(s))
              .catch((e) => console.log(e));
          } catch (error) {
            console.log(error);
          }
        }
        resolve(data);
      });
    } catch (error) {
      console.log(error);
      reject("error");
    }
  });
};

const compute = async function (filename, companyname, days, rate) {
  return new Promise((resolve, reject) => {
    let filepath = "Data/GRStock/" + filename;
    if (fs.existsSync(filepath)) {
      let stream = fs.createReadStream(filepath);
      let nums = 0;
      csv
        .parseStream(stream, { headers: true, maxRows: days })
        .on("data", (data) => {
          if (data["Close Price GR"] > rate) {
            nums = nums + 1;
          }
        })
        .on("end", () => {
          resolve({
            company: companyname,
            numberOfDays: nums,
            percentOfDays: ((nums / days) * 100).toFixed(3),
            totalNumberOfDays: days,
            rate: rate * 100,
          });
        });
    } else {
      reject("error");
    }
  });
};
const computeForSingleCompany = async function (
  filename,
  companyname,
  days,
  rate
) {
  return new Promise((resolve, reject) => {
    let filepath = "Data/GRStock/" + filename;
    if (fs.existsSync(filepath)) {
      let stream = fs.createReadStream(filepath);
      let nums = 0;
      csv
        .parseStream(stream, { headers: true, maxRows: days })
        .on("data", (data) => {
          if (data["Close Price GR"] > rate) {
            nums = nums + 1;
          }
        })
        .on("end", () => {
          resolve({
            company: companyname,
            numberOfDays: nums,
            percentOfDays: ((nums / days) * 100).toFixed(3),
            totalNumberOfDays: days,
            rate: rate * 100,
          });
        });
    } else {
      reject("error");
    }
  });
};
module.exports = router;
