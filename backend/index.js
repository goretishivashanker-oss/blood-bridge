require("dotenv").config();
const express = require("express");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

// Middleware
app.use(cors({ origin: frontendUrl }));
app.use(express.json());

// Main Routes
app.use("/api/donors", donorRoutes);

// Fallback Route
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// Start server
app.listen(port, () => {
    console.log(`Blood Bridge Secure API is running on http://localhost:${port}`);
    console.log(`Accepting requests only from: ${frontendUrl}`);
});
