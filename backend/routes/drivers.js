const express = require("express");
const Driver = require("../models/Driver");
const router = express.Router();

// Add driver
router.post("/", async (req, res) => {
  try {
    const driver = new Driver(req.body);
    const saved = await driver.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all drivers
router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update driver status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
