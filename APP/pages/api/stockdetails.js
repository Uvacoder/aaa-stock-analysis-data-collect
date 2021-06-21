const axios = require("axios");

export default async (req, res, next) => {
  try {
    let company = req.query["company"];
    if (company === undefined) {
      res.status(404).send({ error: "error" });
    } else {
      company = company.toUpperCase();
      const companywithidURL =
        "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/companywithid.json";
      const stockdetailsURL =
        "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Stock";
      axios
        .get(companywithidURL)
        .then((s) => {
          if (s.status === 200) {
            const companywithid = s.data;
            const code = parseInt(companywithid[company]);
            axios
              .get(stockdetailsURL + "/" + code + ".csv")
              .then((t) => {
                if (t.status === 200) {
                  let stockdetails = [];
                  let rows = t.data.split("\n");
                  const header = rows[0].split(",");
                  for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const cols = row.split(",");
                    var result = cols.reduce(function (result, field, index) {
                      result[header[index].replace(/(\r\n|\n|\r)/gm, "")] =
                        field.replace(/(\r\n|\n|\r)/gm, "");
                      return result;
                    }, {});
                    stockdetails.push(result);
                  }
                  res.send(stockdetails);
                }
              })
              .catch((error) => {
                console.log(error);
                res.status(404).send({ error: "error" });
              });
          } else {
            res.status(404).send({ error: "error" });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(404).send({ error: "error" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
};
