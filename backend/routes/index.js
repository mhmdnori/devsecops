const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Api is running and test commite!</h1>");
});

module.exports = router;
