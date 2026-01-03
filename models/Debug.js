const mongoose = require("mongoose");

const DebugSchema = new mongoose.Schema(
  {
    program_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    program_name: {
      type: String,
      required: true
    },

    buggy_program: {
      type: String,
      required: true
    },

    language: {
      type: String,
      default: "python"
    },

    test_cases: [
      {
        input: {
          type: String,
          required: true
        },
        expected_output: {
          type: String,
          required: true
        },
        weight: {
          type: Number,
          default: 1
        }
      }
    ],

    max_score: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Debug", DebugSchema);
