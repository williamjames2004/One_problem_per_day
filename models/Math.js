const mongoose = require("mongoose");

const MathSchema = new mongoose.Schema(
  {
    qtn_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    domain: {
      type: String,
      required: true
      // algebra, geometry, calculus, probability...
    },

    question: {
      type: String,
      required: true
    },

    clue: {
      type: String,
      default: ""
    },

    correct_answers: {
      type: [String],
      required: true
    },

    answer_type: {
      type: String,
      enum: ["integer", "float", "fraction", "expression", "text"],
      default: "float"
    },

    tolerance: {
      type: Number,
      default: 0
    },

    unit: {
      type: String,
      default: ""
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium"
    },

    max_score: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Math", MathSchema);
