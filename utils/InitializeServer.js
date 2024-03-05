import {createServer} from "node:http";
import { Server } from "socket.io";
import express from "express";


const expressApp = express();
const server = createServer(expressApp);

export default server;
