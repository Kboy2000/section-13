const mongoose = require("mongoose"); // Imports Mongoose for schema creation
const bcrypt = require("bcryptjs"); // Imports bcrypt for password hashing

const userSchema = mongoose.Schema(
  // Defines a new Mongoose schema for users
  {
    name: {
      // Defines the name field
      type: String, // Sets the data type to String
      required: [true, "Please add a name"], // Makes the field required with a custom error message
    },
    email: {
      // Defines the email field
      type: String, // Sets the data type to String
      required: [true, "Please add an email"], // Makes the field required
      unique: true, // Ensures email is unique in the database
      match: [/.+\@.+\..+/, "Please add a valid email"], // Validates email format with regex
    },
    password: {
      // Defines the password field
      type: String, // Sets the data type to String
      required: [true, "Please add a password"], // Makes the field required
      minlength: 6, // Sets minimum length for password
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt timestamps automatically
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Defines a pre-save middleware for hashing passwords
  if (!this.isModified("password")) {
    // Checks if the password field has been modified
    next(); // Skips hashing if password isn't modified
  }
  const salt = await bcrypt.genSalt(10); // Generates a salt with 10 rounds;
  this.password = await bcrypt.hash(this.password, salt); // Hashes the password with the salt
  next(); // Proceeds to the next middleware or save operation
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Adds a method to compare passwords
  return await bcrypt.compare(enteredPassword, this.password); // Compares entered password with hashed password
};

module.exports = mongoose.model("User", userSchema); // Exports the User model based on the schema
