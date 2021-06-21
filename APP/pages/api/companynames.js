const axios = require("axios");

export default (req, res) => {
  try {
    const companywithidURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/companywithid.json";
    axios
      .get(companywithidURL)
      .then((s) => {
        if (s.status === 200) {
          const companyNames = Object.keys(s.data);
          res.send(companyNames);
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
