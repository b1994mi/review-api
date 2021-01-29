require("dotenv").config();

const express = require("express");
const cors = require("cors");
// const bodyParser = require("body-parser");
const multer = require("multer");

const PORT = process.env.PORT || 5050;
const app = express();
const upload = multer();

//Helpers
const { api } = require("./helpers/index");

// Database Connetion
// require("./configs/db");
// const { sequelize, Reviews } = require('./models')
// sequelize.sync({force:true})

// Middleware
app.use(express.json())
app.use(cors());
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array("images", 4));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World keke wkwk")
});

const reviewRoute = require("./routes/review");

app.use("/api/v1/review", reviewRoute);

app.listen(PORT, () => {
  console.log(`Server running at server => ${PORT}`);
});
