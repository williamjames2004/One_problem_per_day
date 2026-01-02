const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  quiz_name: {
    type: String,
    required: true
  },

  quiz_id: {
    type: String,
    required: true,
    unique: true
  },

  domain: {
    type: String,
    required: true
  },

  field: {
    type: String,
    required: true
  },

  questions: [
    {
      qtn: {
        type: String,
        required: true
      },
      options: {
        type: [String],
        validate: {
          validator: v => v.length === 4,
          message: "Exactly 4 options required"
        }
      },
      correct_answer: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model("Quiz", QuizSchema);
