const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items"); // ✅ add this
const orderRoutes = require("./routes/orders");
const driverRoutes = require("./routes/drivers");

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes); // ✅ mount item routes
app.use("/api/orders", orderRoutes);
app.use("/api/drivers", driverRoutes);

// DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
