const express = require("express");
const cors = require("cors");
var multer = require('multer');
var upload = multer();
const PORT = process.env.PORT || 5000;
const app = express();
const reviewRoute = require("./routes/review");
// const { sequelize } = require('./models'); sequelize.sync({ force: true });
// Middleware
app.use(upload.array("images", 4));
app.use(cors());

// Routes
app.get("/", (req, res) => {
  res.send("Selamat datang di API hasil fork saya ini. :)")
});

app.use("/api/v1/review", reviewRoute);

app.listen(PORT, () => {
  console.log(`Server running at server => ${PORT}`);
});
