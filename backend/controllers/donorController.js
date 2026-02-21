const db = require("../config/db");

// Haversine formula to compute distance in KM
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// @desc    Get all donors or search
// @route   GET /api/donors
const getDonors = (req, res) => {
    const { bloodType, search, userLat, userLng } = req.query;

    let query = "SELECT * FROM donors WHERE 1=1";
    const params = [];

    if (bloodType && bloodType !== "all") {
        query += " AND bloodType = ?";
        params.push(bloodType);
    }

    if (search) {
        query += " AND (city LIKE ? OR name LIKE ?)";
        const wildcardSearch = `%${search}%`;
        params.push(wildcardSearch, wildcardSearch);
    }

    query += " ORDER BY available DESC, id DESC LIMIT 100";

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }

        let processedDonors = rows.map((r) => {
            let donor = { ...r, available: r.available === 1 };

            // Calculate real distance if coordinates provided
            if (userLat && userLng && donor.lat && donor.lng) {
                const distKm = calculateDistance(parseFloat(userLat), parseFloat(userLng), donor.lat, donor.lng);
                donor.calculatedDistance = distKm;
                donor.distance = distKm.toFixed(1) + " km";
            } else {
                donor.calculatedDistance = 999999; // Fallback to put them at the end if sorting
                if (!donor.distance || donor.distance === "Unknown") {
                    donor.distance = "N/A Location";
                }
            }
            return donor;
        });

        // If we computed real distances, sort by closest geographical proximity first!
        if (userLat && userLng) {
            processedDonors = processedDonors.sort((a, b) => {
                // Tie breaks (available folks first)
                if (a.available !== b.available) return b.available ? 1 : -1;
                return a.calculatedDistance - b.calculatedDistance;
            });
        }

        res.json(processedDonors);
    });
};

// @desc    Register a new donor
// @route   POST /api/donors
const createDonor = (req, res) => {
    const { name, bloodType, city, contact, age, lastDonation, available, lat, lng } = req.body;

    if (!name || !bloodType || !city) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Basic generation around Mumbai center if tracking is disabled by the user
    const finalLat = lat || (19.0 + (Math.random() * 0.2));
    const finalLng = lng || (72.8 + (Math.random() * 0.2));

    const newDonor = {
        name,
        bloodType,
        distance: "Unknown",
        lastDonation: lastDonation ? lastDonation : "Never",
        available: available !== undefined ? (available ? 1 : 0) : 1,
        city,
        contact: contact || "N/A",
        age: age ? parseInt(age) : null,
        lat: finalLat,
        lng: finalLng
    };

    db.run(
        `INSERT INTO donors (name, bloodType, distance, lastDonation, available, city, contact, age, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            newDonor.name,
            newDonor.bloodType,
            newDonor.distance,
            newDonor.lastDonation,
            newDonor.available,
            newDonor.city,
            newDonor.contact,
            newDonor.age,
            newDonor.lat,
            newDonor.lng
        ],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to insert donor" });
            }
            res.status(201).json({ id: this.lastID, ...newDonor, available: newDonor.available === 1 });
        }
    );
};

module.exports = {
    getDonors,
    createDonor,
};
