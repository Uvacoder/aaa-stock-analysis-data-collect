const axios = require("axios");
export default (req, res, next) => {
  try {
    let company = req.query["company"];
    company = company.toUpperCase();
    const suggestURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/Top/simres_180.csv";
    const companywithidURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/companywithid.json";
    axios
      .get(companywithidURL)
      .then((s) => {
        if (s.status === 200) {
          const code = parseInt(s.data[company]);
          axios
            .get(suggestURL)
            .then((t) => {
              if (t.status === 200) {
                let suggestion = "";
                let rows = t.data.split("\n");
                const header = rows[0].replace("\r", "").split(",");
                const codeindex = header.indexOf("code");
                const suggestindex = header.indexOf("suggest");
                for (let i = 1; i < rows.length - 1; i++) {
                  let row = rows[i].split(",");
                  if (parseInt(row[codeindex]) == code) {
                    suggestion = row[suggestindex].replace("\r", "");
                    break;
                  }
                }
                res.send({ suggest: suggestion });
              } else {
                res.status(404).send({ error: "error" });
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
  } catch (error) {
    console.log(error);
    res.status(404).send({ error: "error" });
  }
};
