import { Server } from "socket.io";
import server from "./InitializeServer.js";

const io = new Server(server);
export default io;