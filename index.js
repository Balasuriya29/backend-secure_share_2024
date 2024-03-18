//Required Packages
import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./utils.js";
import fileRouter from "./routes/file.js";
import http from "http";
import {Server} from "socket.io";
import { log } from "console";
import TimeExpirationHandler from "./handlers/TimeExpirationHandler.js";
import LocationHandler from "./handlers/LocationHandler.js";
import { getSharedFile, isShareTypeContainsTime } from "./utils/FileHelper.js";


// Imports
import { connectDB } from "./connection.js";
import files from "./routes/files.js";
import authRouter from "./routes/auth.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  // credentials:true,
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

app.use("/api/files", files);

// Default Check Route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth",authRouter);

app.use("/api/file",fileRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173"
  }
}); 

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log("Socket connection id : ",socket.id);
  socket.on("getFile",async (data)=>{
    const shareId = data["shareId"];
    if(!shareId){
      socket.emit('error',{message:"shareId required"});
      socket.disconnect();
      return;
    }

    // Fetching shareTypes of file
    const sharedFileResult = await getSharedFile(shareId);
    if(!sharedFileResult.success){
      socket.emit('error',{message:"file not found"});
      socket.disconnect();
    }

    const sharedFile = sharedFileResult.data;

    if(isShareTypeContainsTime(sharedFile["shareTypes"])){
      console.log('---Share type is time-----');
      TimeExpirationHandler(sharedFile,socket);
    }
    // LocationHandler(data,socket)
  })
});

server.listen(3001, () => {
  console.log('socket running at http://localhost:3001');
});
