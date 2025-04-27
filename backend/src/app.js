const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
// const responseRoutes = require("./routes/responseRoutes"); 
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "http://localhost:3000" })); 
// Routes
app.use("/api/auth", authRoutes);  
// app.use("/api/responses", responseRoutes); 


// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

module.exports = app;
