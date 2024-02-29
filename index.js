import express from "express";
import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./utils.js";
import fileRouter from "./routes/file.js";
import http from "http";
import {Server} from "socket.io";
import { log } from "console";
import TimeExpirationHandler from "./handlers/TimeExpirationHandler.js";
import LocationHandler from "./handlers/LocationHandler.js";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectToMongoDB();

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
  socket.on("getFile",(data)=>{
    const fileId = data["fileId"];
    if(!fileId){
      socket.emit('error',{message:"fileId required"});
      return;
    }
    TimeExpirationHandler(fileId,socket);
    // LocationHandler(data,socket)
  })
});

server.listen(3001, () => {
  console.log('socket running at http://localhost:3001');
});
