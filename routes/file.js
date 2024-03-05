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


fileRouter.get("/:fileId",(req,res)=>{
    console.log(req.app.server);
});

fileRouter.post("/getShareLink", async (req,res) => {

    const {fileId} = req.body;

    if(fileId && !validateFileId(fileId)){
        res.status(404).json({success:false,message:"File not found"});
        return;
    }

    // Get the file sharing attributes from body

    const {error,value,warning} = getFileLinkSchema.validate(req.body);
    if(error){
        res.send(error.details[0].message);
        return;
    }

    const {shareTypes, shareAttributes} = req.body;

    const shareAttributesValidationResult = validateShareAttributes(shareTypes,shareAttributes);

    if(!shareAttributesValidationResult){
        res.status(400).json({success:false,message:'Invalid shareAttribute details'})
    }

     // Create a new transaction in db and save the fileid and attributes

     const shareModelResult = await createShareModel(req.body);

     if(!shareModelResult.success){
         res.json(shareModelResult);
         return;
     }

     const shareId = shareModelResult.data.shareId;
    
    // Generate the link and send
    res.json(
        {
            success:true,
            data:
            {
                shareId:shareId,
                link:`${process.env.FRONTEND_URL}/file/share/${shareId}`
            }
        }
    )
});


export default fileRouter;