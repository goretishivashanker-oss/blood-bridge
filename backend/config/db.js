const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// One-time seed: only inserts mock data if the donors table is empty
async function seedIfEmpty() {
    const { data, error } = await supabase
        .from("donors")
        .select("id")
        .limit(1);

    if (error) {
        if (JSON.stringify(error).includes("42P01") || error.code === "42P01") {
            console.error("❌ 'donors' table does not exist in Supabase.");
            console.error("   Please run the CREATE TABLE SQL in your Supabase SQL Editor.");
            console.error("   See the implementation_plan.md for the full SQL.");
        } else {
            console.error("❌ Supabase error:", JSON.stringify(error));
        }
        return;
    }

    if (data && data.length > 0) {
        const { count } = await supabase.from("donors").select("*", { count: "exact", head: true });
        console.log(`✅ Supabase connected. ${count} donors already in cloud database.`);
        return;
    }

    console.log("🌱 Table is empty — seeding initial mock donor data into Supabase...");

    const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    const cities = ["Mumbai", "Thane", "Navi Mumbai", "Pune"];
    const baseCoords = {
        "Mumbai": { lat: 19.0760, lng: 72.8777 },
        "Thane": { lat: 19.2183, lng: 72.9781 },
        "Navi Mumbai": { lat: 19.0330, lng: 73.0297 },
        "Pune": { lat: 18.5204, lng: 73.8567 },
    };
    const firstNames = ["Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan", "Shaurya", "Atharv", "Aaryan", "Dhruv", "Kabir", "Neha", "Diya", "Aisha", "Aditi", "Pooja", "Anjali", "Riya", "Sneha", "Kriti", "Shruti", "Swati", "Megha", "Priyanka", "Simran"];
    const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Reddy", "Nair", "Gupta", "Jain", "Desai", "Joshi", "Kumar", "Bawane", "Mehta", "Shah", "Agarwal", "Mishra", "Pandey"];

    const donors = [
        { name: "Ananya Sharma", bloodType: "O+", distance: "Unknown", lastDonation: "3 months ago", available: true, city: "Mumbai", contact: "+91 9876543210", age: 25, lat: 19.0760, lng: 72.8777 },
        { name: "Rahul Verma", bloodType: "A+", distance: "Unknown", lastDonation: "6 months ago", available: true, city: "Mumbai", contact: "+91 9123456780", age: 30, lat: 19.0820, lng: 72.8810 },
        { name: "Priya Patel", bloodType: "B+", distance: "Unknown", lastDonation: "4 months ago", available: true, city: "Thane", contact: "+91 9988776655", age: 28, lat: 19.2183, lng: 72.9781 },
        { name: "Vikram Singh", bloodType: "O-", distance: "Unknown", lastDonation: "2 months ago", available: false, city: "Navi Mumbai", contact: "+91 8877665544", age: 35, lat: 19.0330, lng: 73.0297 },
        { name: "Sneha Reddy", bloodType: "AB+", distance: "Unknown", lastDonation: "5 months ago", available: true, city: "Mumbai", contact: "+91 7766554433", age: 24, lat: 19.0500, lng: 72.8900 },
        { name: "Arjun Nair", bloodType: "A-", distance: "Unknown", lastDonation: "1 month ago", available: true, city: "Pune", contact: "+91 6655443322", age: 29, lat: 18.5204, lng: 73.8567 },
    ];

    for (let i = 1; i <= 200; i++) {
        const bt = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const city = cities[Math.floor(Math.random() * cities.length)];
        const available = Math.random() > 0.3;
        const age = Math.floor(Math.random() * 48) + 18;
        const lat = baseCoords[city].lat + (Math.random() - 0.5) * 0.1;
        const lng = baseCoords[city].lng + (Math.random() - 0.5) * 0.1;
        const lastDonation = Math.floor(Math.random() * 12 + 1) + " months ago";
        const contact = "+91 " + Math.floor(1000000000 + Math.random() * 9000000000);
        const name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
        donors.push({ name, bloodType: bt, distance: "Unknown", lastDonation, available, city, contact, age, lat, lng });
    }

    const batchSize = 50;
    for (let i = 0; i < donors.length; i += batchSize) {
        const { error: insertError } = await supabase.from("donors").insert(donors.slice(i, i + batchSize));
        if (insertError) {
            console.error("❌ Seed insert error:", insertError.message);
            return;
        }
    }
    console.log(`✅ Seeded ${donors.length} donors into Supabase cloud database.`);
}

module.exports = { supabase, seedIfEmpty };
