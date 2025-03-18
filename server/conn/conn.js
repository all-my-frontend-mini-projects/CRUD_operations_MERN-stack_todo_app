const mongoose = require("mongoose");

const conn = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/sampleDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        
        // Return error code dynamically if available, otherwise default to 500
        const statusCode = error.code || 500;

        return {
            status: statusCode,
            message: "MongoDB Connection Failed",
            error: error.message,
        };
    }
};

module.exports = conn;
