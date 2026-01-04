const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const debugRoutes = require("./routes/debugRoutes");
const codeRoutes = require("./routes/codeRoutes");
const mathRoutes = require("./routes/mathRoutes");
const userReportRoutes = require("./routes/userReport");

const adminAuthRoutes = require("./routes/adminAuth");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/debug", debugRoutes);
app.use("/code", codeRoutes);
app.use("/math", mathRoutes);
app.use("/submit", userReportRoutes);
app.use("/admin", adminAuthRoutes);

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
