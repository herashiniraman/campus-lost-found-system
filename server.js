const express = require("express");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();

const pool = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT 1 AS db_status");
    res.json({
      success: true,
      message: "Server and database are working",
      db: rows[0].db_status
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});