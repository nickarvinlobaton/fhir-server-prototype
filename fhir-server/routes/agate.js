const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ msg: "AGATE score GET method" });
});

module.exports = router;
