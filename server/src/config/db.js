const mongoose = require("mongoose");

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri || typeof uri !== "string" || !uri.trim()) {
        console.error("❌ MongoDB Configuration Error: MONGODB_URI environment variable is required.");
        process.exit(1);
    }

    try {
        await mongoose.connect(uri.trim(), {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 20,
        });

        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        const safeError = (error.message || "").replace(/\/\/[^@]+@/, "//***:***@");
        console.error(safeError);

        process.exit(1);
    }
};

module.exports = connectDB;