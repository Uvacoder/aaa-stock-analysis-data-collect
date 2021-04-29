const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
router.get("/", async function (req, res, next) {
  let process = spawn("python", ["Data/market_action.py"]);
  process.stdout.on("data", (data) => {
    res.send(data.toString());
  });
});
module.exports = router;
