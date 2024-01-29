//Required Package
const mongoose = require("mongoose");
const config = require("config");

const DB_NAME = "SecureShare";

//Starting Connection
function connectDB() {
  mongoose
    .connect(
      getConnectionString(config.get("DBUserName"), config.get("DBPassword"))
    )
    .then((result) => console.log(`Connected to MongoDB:${DB_NAME}`))
    .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));
}

function getConnectionString(userName, password) {
  console.log(userName + "-" + password);
  return `mongodb+srv://arunkarthickm:Arun%40007@cluster0.dfr13.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}

module.exports.connectDB = connectDB;
