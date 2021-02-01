const express = require("express");
const cors = require("cors");
var multer = require('multer');
var upload = multer({
  limits: { fileSize: 1048576 }, // 1mb max
  fileFilter: function (req, file, cb) {
    const fileTypes = /png|jpeg|jpg|webp|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType) {
      cb(null, true);
    } else {
      cb("Error: only png, jpeg, and jpg are allowed!");
    }
  },
});
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
