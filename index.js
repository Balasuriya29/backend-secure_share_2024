//Required Packages
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Imports
const connection = require("./connection");
const files = require("./routes/files");

const app = express();
const port = 3000;
require("dotenv").config();

//Connection to MongoDB
connection.connectDB();

app.use(cors());
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(express.json());

app.use("/api/files", files);

// Default Check Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
