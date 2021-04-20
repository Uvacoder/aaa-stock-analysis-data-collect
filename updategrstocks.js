const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const featurecreationfilepath = path.join(
  __dirname,
  "ScrapingAndFeatureCreation",
  "PythonFiles",
  "solution.py"
);

const companies = [
  500002,
  500003,
  500008,
  500009,
  500010,
  500012,
  500013,
  500014,
  500020,
  500023,
  500027,
  500028,
  500029,
  500031,
  500032,
  500033,
  500034,
  500038,
  500039,
  500040,
  500041,
  500042,
  500043,
  500048,
  500049,
  500052,
  500055,
  500060,
  500067,
  500068,
  500069,
  500074,
  500078,
  500083,
  500084,
  500085,
  500086,
  500087,
  500089,
  500092,
  500093,
  500096,
  500097,
  500101,
  500102,
  500103,
  500104,
  500106,
  500108,
  500109,
  500110,
  500111,
  500112,
  500113,
  500114,
  500116,
  500117,
  500119,
  500120,
  500123,
  500124,
  500125,
  500126,
  500128,
  500133,
  500135,
  500136,
  500143,
  500144,
  500147,
  500148,
  500150,
  500151,
  500153,
  500159,
  500160,
  500163,
  500164,
  500165,
  500166,
  500168,
  500170,
  500171,
  500173,
  500174,
  500179,
  500180,
  500182,
  500183,
  500184,
  500185,
  500186,
  500187,
  500188,
  500189,
  500191,
  500192,
  500193,
  500199,
  500201,
  500202,
  500206,
  500207,
  500209,
  500210,
  500211,
  500212,
  500213,
  500214,
  500215,
  500219,
  500220,
  500223,
  500227,
  500228,
  500231,
  500233,
  500234,
  500235,
  500236,
  500238,
  500239,
  500240,
  500241,
  500243,
  500245,
  500246,
  500247,
  500248,
  500249,
  500250,
  500251,
  500252,
  500253,
  500257,
  500259,
  500260,
  500264,
  500265,
  500266,
  500267,
  500268,
  500271,
  500274,
  500277,
  500279,
  500280,
  500284,
  500285,
];

const datafolderpath = path.join(__dirname, "Data");
const stockfolderpath = path.join(__dirname, "Data", "Stocks");

const backendfolderpath = path.join(
  __dirname,
  "..",
  "stock-analysis-tool-backend",
  "static",
  "stocks",
  "grstocks"
);

const runScript = async (element) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      featurecreationfilepath,
      element,
      datafolderpath,
    ]);
    python.stdout.on("data", async (res) => {
      const stockfilepath = path.join(
        stockfolderpath,
        "gr" + element.toString() + ".csv"
      );
      const stockfilepathbackend = path.join(
        backendfolderpath,
        element.toString() + ".csv"
      );
      fs.copyFile(stockfilepath, stockfilepathbackend, (err) => {});
      resolve("success");
    });
  });
};

const main = async () => {
  for (let index = 0; index < companies.length; index++) {
    const element = companies[index];
    console.log(element);
    await runScript(element)
      .then((s) => {
        console.log(s);
      })
      .catch((err) => {
        console.log(err);
      });
    break;
  }
};

main();
