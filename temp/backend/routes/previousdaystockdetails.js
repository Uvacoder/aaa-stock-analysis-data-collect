const express = require("express");
const router = express.Router();
const fs = require("fs");
const csv = require("fast-csv");
const process = require("process");
const underscore = require("underscore");

router.get("/", async function (req, res, next) {
  console.log(req.url);
  let company = req.query["company"];
  if (company === undefined) {
    try {
      await readAndCompute()
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
  } else {
    try {
      company = company.toUpperCase();
      console.log(company);
      await computeForSingleCompany(company)
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

const readAndCompute = async function () {
  var companywithid = JSON.parse(
    fs.readFileSync("Data/companywithid.json", "utf8")
  );

  companywithid = underscore.invert(companywithid);
  return new Promise((resolve, reject) => {
    try {
      let data = [];
      fs.readdir("Data/Stock", async (error, files) => {
        for (let index = 0; index < files.length; index++) {
          try {
            const element = files[index];
            await compute(element, companywithid[element.slice(0, 6)])
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

const compute = async function (filename, companyname) {
  return new Promise((resolve, reject) => {
    let filepath = "Data/Stock/" + filename;
    if (fs.existsSync(filepath)) {
      let stream = fs.createReadStream(filepath);
      let mydata = "";
      csv
        .parseStream(stream, { headers: true, maxRows: 1 })
        .on("data", (data) => {
          mydata = data;
          mydata["company"] = companyname;
        })
        .on("end", () => {
          resolve(mydata);
        });
    } else {
      reject("error");
    }
  });
};

const computeForSingleCompany = async function (companyname) {
  var companywithid = JSON.parse(
    fs.readFileSync("Data/companywithid.json", "utf8")
  );
  const filename = companywithid[companyname];
  return new Promise((resolve, reject) => {
    let filepath = "Data/Stock/" + filename + ".csv";
    if (fs.existsSync(filepath)) {
      console.log(filepath);
      let stream = fs.createReadStream(filepath);
      let mydata = "";
      csv
        .parseStream(stream, { headers: true, maxRows: 1 })
        .on("data", (data) => {
          mydata = data;
          mydata["company"] = companyname;
        })
        .on("end", () => {
          resolve(mydata);
        });
    } else {
      reject("error");
    }
  });
};
module.exports = router;
