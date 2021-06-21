const axios = require("axios");

export default (req, res, next) => {
  try {
    const sp500URL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/sp500.csv";
    axios
      .get(sp500URL)
      .then((s) => {
        if (s.status === 200) {
          let sp500details = [];
          let rows = s.data.split("\n");
          const header = rows[0].split(",");
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cols = row.split(",");
            var result = cols.reduce(function (result, field, index) {
              result[header[index].replace(/(\r\n|\n|\r)/gm, "")] =
                field.replace(/(\r\n|\n|\r)/gm, "");
              return result;
            }, {});
            sp500details.push(result);
          }
          res.send(sp500details);
        } else {
          res.status(404).send({ error: "error" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(404).send({ error: "error" });
      });
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
};
