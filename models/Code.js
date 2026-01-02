const mongoose = require("mongoose");

const PracticeSchema = new mongoose.Schema(
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

    problem_statement: {
      type: String,
      required: true
    },

    language: {
      type: String,
      default: "python"
    },

    constraints: {
      type: String,
      default: ""
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
        },
        is_hidden: {
          type: Boolean,
          default: true
        }
      }
    ],

    max_score: {
      type: Number,
      default: 1
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy"
    },

    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Practice", PracticeSchema);