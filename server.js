const express = require("express"); // Imports Express framework
 const dotenv = require("dotenv").config(); // Loads environment variables from .env file
 const connectDB = require("./config/db"); // Imports database connection function 


// Connect to database 
connectDB(); // Initiates MongoDB connection

 const app = express(); // Creates an Express application instance 

 // Middleware 
app.use(express.json()); // Parses incoming JSON requests 
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded data 


// Routes 
app.use("/api/users", require("./routes/userRoute")); // Mounts user routes at /api/users 
const PORT = process.env.PORT || 4000; // Sets port from .env or defaults to 5000 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
// Starts server and logs port