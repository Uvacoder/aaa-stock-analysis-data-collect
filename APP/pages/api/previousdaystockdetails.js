const axios = require("axios");

export default async (req, res, next) => {
  try {
    const companywithidURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/companywithid.json";
    const previousdaystockdetailsURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Stock/previousdaystockdetails.csv";
    let company = req.query["company"];
    if (company === undefined) {
      axios
        .get(previousdaystockdetailsURL)
        .then((t) => {
          if (t.status === 200) {
            let previousdaystockdetails = [];
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
              previousdaystockdetails.push(result);
            }
            res.send(previousdaystockdetails);
          } else {
            res.status(404).send({ error: "error" });
          }
        })
        .catch((error) => {
          console.log(error);
          res.status(404).send({ error: "error" });
        });
    } else {
      company = company.toUpperCase();
      axios
        .get(companywithidURL)
        .then((s) => {
          if (s.status === 200) {
            const companywithid = s.data;
            const code = parseInt(companywithid[company]);
            axios
              .get(previousdaystockdetailsURL)
              .then((t) => {
                if (t.status === 200) {
                  let rows = t.data.split("\n");
                  const header = rows[0].split(",");
                  const codeindex = header.indexOf("Code");
                  for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const cols = row.split(",");
                    if (parseInt(cols[codeindex]) === code) {
                      var result = cols.reduce(function (result, field, index) {
                        result[header[index].replace(/(\r\n|\n|\r)/gm, "")] =
                          field.replace(/(\r\n|\n|\r)/gm, "");
                        return result;
                      }, {});
                      res.send(result);
                      break;
                    }
                  }
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
