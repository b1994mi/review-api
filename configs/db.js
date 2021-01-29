require("dotenv").config();

const mongoose = require("mongoose");
const HOST = "mongodb://127.0.0.1:27017/";

mongoose.connect(
  HOST,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000
  },
  err => {
    if (err) throw err;
    console.log("database connected");
  }
);
mongoose.set("useCreateIndex", true);
