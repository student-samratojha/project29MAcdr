const mongoose = require("mongoose");
const mongoURI = process.env.MONGO_URI;
async function connectDB() {
    try {
      await mongoose.connect(mongoURI);
      console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
  }
  module.exports = connectDB;