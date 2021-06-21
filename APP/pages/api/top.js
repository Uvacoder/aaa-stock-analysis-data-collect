const axios = require("axios");

export default (req, res, next) => {
  try {
    const type = req.query["type"];
    const num = parseInt(req.query["num"]);
    // res.send([type, num]);
    const topurl =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Top/type_180.csv";
    axios
      .get(topurl.replace("type", type))
      .then((s) => {
        if (s.status === 200) {
          let topdetails = [];
          let rows = s.data.split("\n");
          const header = rows[0].split(",");
          const companyindex = header.indexOf("company");
          for (let i = 1; i < num + 1; i++) {
            const row = rows[i];
            const cols = row.split(",");
            // var result = cols.reduce(function (result, field, index) {
            //   result[header[index].replace(/(\r\n|\n|\r)/gm, "")] =
            //     field.replace(/(\r\n|\n|\r)/gm, "");
            //   return result;
            // }, {});
            topdetails.push(cols[companyindex]);
          }
          res.send(topdetails);
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
