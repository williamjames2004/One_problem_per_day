const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const userReportRoutes = require("./routes/userReport");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/submit", userReportRoutes);

const PORT = 5000;
app.listen(5000,() => {
  console.log("Server running on "+PORT);
});