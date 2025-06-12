const mongoose = require("mongoose"); // Imports Mongoose for MongoDB interaction

const connectDB = async () => {
  // Defines an async function to connect to MongoDB
  try {
    // Starts a try block to handle potential errors
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Connects to MongoDB using the URI from .env
      useNewUrlParser: true, // Ensures the new URL parser is used
      useUnifiedTopology: true, // Uses the new topology engine for MongoDB
    });
    console.log(`MongoDB Connected Successfully: ${conn.connection.host}`); // Logs successful connection with host name
  } catch (error) {
    // Catches any connection errors
    console.error(`Error: ${error.message}`); // Logs the error message
    process.exit(1); // Exits the process with failure code
  }
};

module.exports = connectDB; // Exports the connectDB function for use in other file
