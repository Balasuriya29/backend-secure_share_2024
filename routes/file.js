import express from "express";
import { createShareModel, validateFileId } from "../utils/FileHelper.js";
import { getFileLinkSchema, validateShareAttributes } from "../utils/ValidationSchemas.js";
import crypto from 'crypto';
const fileRouter = express();

fileRouter.get('/sse/:fileId', (req, res) => {
    const expirationTime = new Date(Date.now() + ( 10 * 1000));
    console.log("Expiration time : ",expirationTime);
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    });
        
    const sendData = (message) => {
        res.write(`data: ${JSON.stringify({status:"closed",message:message})}\n\n`);
    };

    var loopController = true;
    while(loopController){
        if(Date.now() < expirationTime){
            sendData("Can access the file");
            console.log("Can access the file");
        }
        else{
            sendData("This file is no longer available");
            loopController = false;
        }
    }
    
    // Close SSE connection when the client disconnects
    req.on("close", () => {
        console.log("Closing connection");
    });
});



export default fileRouter;