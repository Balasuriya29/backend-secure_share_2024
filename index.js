//Required Packages
import express, { json } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToMongoDB } from "./utils.js";
import fileRouter from "./routes/file.js";
import http from "http";
import { Server } from "socket.io";
import { log } from "console";
import TimeExpirationHandler from "./handlers/TimeExpirationHandler.js";
import LocationHandler from "./handlers/LocationHandler.js";
import { getSharedFile, isShareTypesContains } from "./utils/FileHelper.js";

// Imports
import { connectDB } from "./connection.js";
import files from "./routes/files.js";
import authRouter from "./routes/auth.js";
import ShareFile from "./models/ShareFileModel.js";
import IPControlHandler from "./handlers/IPControlHandler.js";

const app = express();

const corsOptions = {
  origin: "*",
  // credentials:true,
};

app.use(cors());

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

app.use("/api/auth", authRouter);

app.use("/api/file", fileRouter);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log("Socket connection id : ", socket.id);

  socket.on("disconnect", () => {
    console.log(`${socket.id} has been disconnected`);
  });

  socket.on("getFile", async (data) => {
    const shareId = data["shareId"];
    if (!shareId) {
      socket.emit("error", { message: "shareId required" });
      socket.disconnect();
      return;
    }

    console.log(`-----SHARE ID : ${shareId}----------`);

    // Fetching shareTypes of file
    const sharedFileResult = await getSharedFile(shareId);
    if (!sharedFileResult.success) {
      socket.emit("error", { message: "file not found" });
      socket.disconnect();
    }

    const sharedFile = sharedFileResult.data;

    console.log("-----shared file------");
    console.log(sharedFile);

    const shareTypes = sharedFile.shareTypes;
    let fileStatus = { allowAccess: false };

    if (isShareTypesContains(shareTypes, "ipControl")) {
      // Handle IP control
      const result = await IPControlHandler(socket, sharedFile);
      fileStatus = result;
    }

    if (isShareTypesContains(shareTypes, "geoFence")) {
      // Handle geoFence
      if (!data["latitude"] || !data["longitude"]) {
        socket.emit("getLocationDetails");
        return;
      }
      fileStatus = LocationHandler(sharedFile, {
        latitude: data["latitude"],
        longitude: data["longitude"],
      });
    }

    if (isShareTypesContains(shareTypes, "time")) {
      TimeExpirationHandler(sharedFile, socket);
    } else if (fileStatus.allowAccess) {
      socket.emit("fileStatus", {
        status: "Open",
        fileId: sharedFile.fileId,
        totalChunks: sharedFile.totalChunks,
        showFile: true,
      });
    } else {
      socket.emit("fileStatus", {
        status: "Closed",
        showFile: false,
        message: fileStatus.message,
      });
    }
  });
});

server.listen(3001, () => {
  console.log("socket running at http://localhost:3001");
});
