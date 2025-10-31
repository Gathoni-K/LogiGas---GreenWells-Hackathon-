const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // For hackathon demo - use hardcoded accounts instead of database
    const demoAccounts = [
      {
        email: "dispatcher@greenwells.com",
        password: "greenwells123",
        role: "dispatcher",
        name: "John Maina",
      },
      {
        email: "manager@greenwells.com",
        password: "greenwells123",
        role: "manager",
        name: "Mary Wanjiku",
      },
      {
        email: "admin@greenwells.com",
        password: "greenwells123",
        role: "admin",
        name: "Admin User",
      },
    ];

    // Check against demo accounts
    const user = demoAccounts.find(
      (acc) => acc.email === email && acc.password === password
    );

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.email, role: user.role }, // Use email as ID for demo
      process.env.JWT_SECRET || "demo-secret-for-hackathon",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
