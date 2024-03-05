//Required Packages
import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


// Imports
import { connectDB } from "./connection.js";
import files from "./routes/files.js";
import authRouter from "./routes/auth.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials:true,
};


app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser());


const port = 3000;
dotenv.config();

//Connection to MongoDB
connectDB();

app.use(cors());
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));
app.use(json());

app.use("/api/files", files);

// Default Check Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth",authRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

