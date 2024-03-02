//Required Packages
import express, { json } from "express";
import cors from "cors";
import { raw } from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Imports
import { connectDB } from "./connection";
import files from "./routes/files";

const app = express();
const port = 3000;
dotenv.config();

//Connection to MongoDB
connectDB();

app.use(cors());
app.use(raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(json());

app.use("/api/files", files);

// Default Check Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
