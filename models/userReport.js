const mongoose = require("mongoose");

const UserReportSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },

  quiz: [
    {
      quiz_id: {
        type: String,
        required: true
      },
      total_score: {
        type: Number,
        required: true,
        min: 0
      },
      obtained_score: {
        type: Number,
        required: true,
        min: 0
      },
      percentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("UserReport", UserReportSchema);