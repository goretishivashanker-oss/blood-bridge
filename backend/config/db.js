const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error connecting to SQLite database", err);
    } else {
        console.log("Connected to SQLite database.");
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Drop the table to reconstruct with new schema (in production we'd use migrations)
        db.run("DROP TABLE IF EXISTS donors");

        // Create Donors Table with Lat and Lng
        db.run(
            `CREATE TABLE IF NOT EXISTS donors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        bloodType TEXT NOT NULL,
        distance TEXT,
        lastDonation TEXT,
        available BOOLEAN,
        city TEXT NOT NULL,
        contact TEXT,
        age INTEGER,
        lat REAL,
        lng REAL
      )`
        );

        // Insert mock data equipped securely with coordinates
        console.log("Seeding initial mock data into SQLite featuring Geocoordinates...");
        const stmt = db.prepare(
            `INSERT INTO donors (name, bloodType, distance, lastDonation, available, city, contact, age, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        // Approximate Coordinates for mock
        // Mumbai (19.0760, 72.8777), Thane (19.2183, 72.9781), Navi Mumbai (19.0330, 73.0297), Pune (18.5204, 73.8567)
        const mockDonors = [
            ["Ananya Sharma", "O+", "Unknown", "3 months ago", true, "Mumbai", "+91 9876543210", 25, 19.0760, 72.8777],
            ["Rahul Verma", "A+", "Unknown", "6 months ago", true, "Mumbai", "+91 9123456780", 30, 19.0820, 72.8810],
            ["Priya Patel", "B+", "Unknown", "4 months ago", true, "Thane", "+91 9988776655", 28, 19.2183, 72.9781],
            ["Vikram Singh", "O-", "Unknown", "2 months ago", false, "Navi Mumbai", "+91 8877665544", 35, 19.0330, 73.0297],
            ["Sneha Reddy", "AB+", "Unknown", "5 months ago", true, "Mumbai", "+91 7766554433", 24, 19.0500, 72.8900],
            ["Arjun Nair", "A-", "Unknown", "1 month ago", true, "Pune", "+91 6655443322", 29, 18.5204, 73.8567],
        ];

        mockDonors.forEach((d) => stmt.run(d));
        stmt.finalize();
        console.log("Mock geolocation data seeded.");
    });
}

module.exports = db;
