require("dotenv").config();
const express = require("express");
const cors = require("cors");
const donorRoutes = require("./routes/donorRoutes");
const { seedIfEmpty } = require("./config/db");

const path = require("path");

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:8080";

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/donors", donorRoutes);

// Serve the compiled frontend static files
const frontendDistPath = path.join(__dirname, "../blood-donor-finderfrontend-main/dist");
app.use(express.static(frontendDistPath));

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});



app.listen(port, async () => {
    console.log(`Blood Bridge API running on http://localhost:${port}`);
    console.log(`Accepting requests from: ${frontendUrl}`);
    await seedIfEmpty();
});
