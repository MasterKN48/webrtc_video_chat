const express = require("express");
const router = express.Router();
router.get("/api", (req, res) => {
  res.send("Server is running");
});
module.exports = router;
