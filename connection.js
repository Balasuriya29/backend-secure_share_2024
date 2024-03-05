//Required Package
import mongoose from "mongoose";
import config from "config";

const DB_NAME = "SecureShare";

//Starting Connection
function connectDB() {
  mongoose
    .connect(getConnectionString())
    .then((result) => console.log(`Connected to MongoDB:${DB_NAME}`))
    .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));
}

function getConnectionString() {
  return `mongodb+srv://arunkarthickm:Arun%40007@cluster0.dfr13.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
}

const _connectDB = connectDB;

export { _connectDB as connectDB };
