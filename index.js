import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import cors from 'cors';
import server from "./utils/InitializeServer.js";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./utils.js";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectToMongoDB();

app.use("/api/auth",authRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

server.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
