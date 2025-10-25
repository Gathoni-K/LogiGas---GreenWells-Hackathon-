const express = require("express");
const router = express.Router();

// Test POST route
router.post("/", (req, res) => {
  res.json({ message: "Item received", data: req.body });
});

// Test GET route
router.get("/", (req, res) => {
  res.json({ message: "Fetching all items (fake for now)" });
});

module.exports = router;
