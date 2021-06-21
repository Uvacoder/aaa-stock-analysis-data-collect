const axios = require("axios");
export default async (req, res, next) => {
  try {
    const days = req.query["days"];
    const topurl =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Top/simres_days.csv";
    axios
      .get(topurl.replace("days", days))
      .then((s) => {
        if (s.status === 200) {
          let response = [];
          let rows = s.data.split("\n");
          const header = rows[0].split(",");
          const codeindex = header.indexOf("code");
          const companyindex = header.indexOf("company");
          const actualindex = header.indexOf("actual");
          const predindex = header.indexOf("predicted");
          const minindex = header.indexOf("minimum");
          const maxindex = header.indexOf("maximum");
          for (let i = 1; i < rows.length - 1; i++) {
            const row = rows[i].split(",");
            let result = {
              id: i,
              code: row[codeindex],
              company: row[companyindex],
              actual: parseFloat(row[actualindex]).toFixed(6),
              predicted: parseFloat(row[predindex]).toFixed(6),
              minimum: parseFloat(row[minindex]).toFixed(6),
              maximum: parseFloat(row[maxindex]).toFixed(6),
            };
            if (result["minimum"] == "NaN") {
              result["minimum"] = result["actual"];
            }
            if (result["maximum"] == "NaN") {
              result["maximum"] = result["actual"];
            }
            response.push(result);
          }
          res.send(response);
        } else {
          res.status(404).send({ error: "error" });
        }
      })
      .catch((e) => {
        res.status(404).send({ error: "error" });
        console.log(e);
      });
  } catch (error) {
    res.status(404).send({ error: "error" });
  }
};
