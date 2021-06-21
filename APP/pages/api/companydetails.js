const axios = require("axios");
export default (req, res, next) => {
  try {
    let company = req.query["company"];
    const companydetailsURL =
      "https://raw.githubusercontent.com/saikr789/stock-analysis-tool-1011-data/master/Data/companies.json";

    axios
      .get(companydetailsURL)
      .then((s) => {
        if (s.status === 200) {
          const companies = s.data;
          if (company === undefined) {
            res.send(companies);
          } else {
            company = company.toUpperCase();
            res.send(companies[company]);
          }
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
