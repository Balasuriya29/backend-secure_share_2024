import express from "express";
import { validateFileId } from "../utils/FileHelper.js";
import { getFileLinkSchema } from "../utils/ValidationSchemas.js";
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


fileRouter.get("/:fileId",(req,res)=>{
    console.log(req.app.server);
});

fileRouter.post("/getShareLink", (req,res) => {

    const {fileId} = req.body;

    if(fileId && !validateFileId(fileId)){
        res.status(404).json({success:false,message:"File not found"});
        return;
    }

    // Get the file sharing attributes from body

    // const {error,value,warning} = getFileLinkSchema.validate(req.body);
    // if(error){
    //     res.send(error.details);
    //     return;
    // }
    // res.send(value);

    // Hash the attributes 

    
    
    // Generate the link and send


});


export default fileRouter;