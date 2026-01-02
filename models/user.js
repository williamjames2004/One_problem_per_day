const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: [/^[a-zA-Z0-9 ]+$/, "Name must be alphanumeric only"]
  },

  user_id: {
    type: String,
    required: true,
    unique: true,
    minlength: 6
  },

  age: {
    type: Number,
    required: true,
    min: [0, "Age cannot be negative"]
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format"
    }
  },

  phone: {
    type: String,
    required: true,
    match: [/^[0-9]+$/, "Phone number must contain only numbers"]
  },

  country: {
    type: String,
    required: true
  },

  password: {
  type: String,
  required: true
}
});

module.exports = mongoose.model("User", UserSchema);
