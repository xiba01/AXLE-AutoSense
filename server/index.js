const express = require("express");
const cors = require("cors");
require("dotenv").config();

const ingestionRoutes = require("./src/routes/ingestionRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// 1. MIDDLEWARE
// Strict CORS to allow your React Frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Allow your Vite app
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

// Increase JSON limit because our Story objects are big
app.use(express.json({ limit: "10mb" }));

// 2. ROUTES
// We prefix everything with /api/ingest
app.use("/api/ingest", ingestionRoutes);

// 3. HEALTH CHECK
// Good to have to verify server is alive
app.get("/", (req, res) => {
  res.status(200).json({ status: "Online", service: "AutoSense AI Backend" });
});

// 4. GLOBAL ERROR HANDLER
// Catches any crash in the app so the server doesn't die completely
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    details: err.message,
  });
});

// 5. START SERVER
app.listen(PORT, () => {
  console.log(`
  🚗 ========================================
  🚗 AutoSense AI Backend Active
  🚗 Port:    ${PORT}
  🚗 Client:  http://localhost:5173
  🚗 ========================================
  `);
});
