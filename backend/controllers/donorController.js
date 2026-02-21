const { supabase } = require("../config/db");

function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const getDonors = async (req, res) => {
    const { bloodType, search, userLat, userLng } = req.query;

    let query = supabase.from("donors").select("*");

    if (bloodType && bloodType !== "all") query = query.eq("bloodType", bloodType);
    if (search) query = query.or(`city.ilike.%${search}%,name.ilike.%${search}%`);

    query = query.order("available", { ascending: false }).limit(400);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: "Database error" });

    let donors = data.map((r) => {
        let donor = { ...r };
        if (userLat && userLng && donor.lat && donor.lng) {
            const distKm = calculateDistance(parseFloat(userLat), parseFloat(userLng), donor.lat, donor.lng);
            donor.calculatedDistance = distKm;
            donor.distance = distKm.toFixed(1) + " km";
        } else {
            donor.calculatedDistance = 999999;
            if (!donor.distance || donor.distance === "Unknown") donor.distance = "N/A";
        }
        return donor;
    });

    if (userLat && userLng) {
        donors.sort((a, b) => {
            if (a.available !== b.available) return b.available ? 1 : -1;
            return a.calculatedDistance - b.calculatedDistance;
        });
    }

    res.json(donors);
};

const createDonor = async (req, res) => {
    const { name, bloodType, city, contact, age, lastDonation, available, lat, lng } = req.body;
    if (!name || !bloodType || !city) return res.status(400).json({ error: "Missing required fields" });

    const newDonor = {
        name, bloodType, distance: "Unknown",
        lastDonation: lastDonation || "Never",
        available: available !== undefined ? Boolean(available) : true,
        city, contact: contact || "N/A",
        age: age ? parseInt(age) : null,
        lat: lat || (19.0 + Math.random() * 0.2),
        lng: lng || (72.8 + Math.random() * 0.2),
    };

    const { data, error } = await supabase.from("donors").insert([newDonor]).select().single();
    if (error) {
        console.error("❌ Supabase insert error on /api/donors POST:", JSON.stringify(error));
        return res.status(500).json({ error: "Failed to register donor" });
    }
    res.status(201).json(data);
};

module.exports = { getDonors, createDonor };
