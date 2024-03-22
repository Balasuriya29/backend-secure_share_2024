import { Router } from "express";
const router = Router();

import { chunk, chunkSchema } from "../models/chunkModel.js";
import { file, fileSchema } from "../models/fileModel.js";
import { createShareModel, validateFileId } from "../utils/FileHelper.js";
import { getFileLinkSchema, validateShareAttributes } from "../utils/ValidationSchemas.js";
import ShareFile from "../models/ShareFileModel.js";

// GET FILES API
router.get("/:userId", async (req, res) => {
  try {
    let files = await file.find({
      userId: req.params.userId,
    });

    res.status(200).send({
      message: "sucess",
      data: files,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "failure",
    });
  }
});

// GET CHUNK API
router.get("/chunk/download/:chunkId", async (req, res) => {
  try {
    let retrievedChunk = await chunk.findOne({
      fileId: req.params.chunkId,
    });

    if (retrievedChunk) {
      console.log("Sending CHUNK for id " + req.params.chunkId);

      res.status(200).send({
        message: "sucess",
        chunk: {
          fileId: retrievedChunk.fileId,
          data: retrievedChunk.data.toString(),
        },
      });
    } else {
      throw new Error("No Chunk Founds");
    }
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "failure",
      received: {
        chunkId: req.params.chunkId,
      },
    });
  }
});

// POST CHUNK API
router.post("/chunk/upload", async (req, res) => {
  const { currentChunkIndex, fileId } = req.query;

  try {
    if (req.body) {
      console.log(`${currentChunkIndex} received of ${fileId}`);

      let newChunk = chunk({
        data: req.body,
        fileId: fileId,
      });

      console.log(`created chunk ${currentChunkIndex}`);

      await newChunk
        .save()
        .then((v) => {
          console.log(`${currentChunkIndex} saved`);

          res.status(200).send({
            message: "sucess",
            received: {
              chunkIndex: currentChunkIndex,
            },
          });
        })
        .catch((v) => {
          console.log(`error in saving ${currentChunkIndex}`);
          console.log(v);
          res.status(400).send({
            message: "something went wrong",
            received: {
              chunkIndex: currentChunkIndex,
            },
          });
        });
    } else {
      throw new Error("body is empty");
    }
  } catch (error) {
    console.log(`error in saving chunk ${currentChunkIndex}`);
    res.status(400).send({
      message: `failure ${error.message}`,
    });
  }
});

// POST FILE API
router.post("/file/upload", async (req, res) => {
  const { fileId, userId, name, size, type, totalChunks } = req.body;

  let newFile = file({
    fileId: fileId,
    name: name,
    size: size,
    type: type,
    created_at: Date.now(),
    totalChunks: totalChunks,
    userId: userId,
  });

  await newFile
    .save()
    .then(async (v) => {
      res.status(200).send({
        message: "sucess",
        received: {
          fileId: fileId,
        },
      });
    })
    .catch((v) => {
      res.status(200).send({
        message: "failed to create file",
        received: v,
      });
    });
});

// GET SHARED FILE LINK API
router.post("/getShareLink", async (req,res) => {

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

   req.body["connections"] = [];

   console.log(req.body);

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

// GET USER SHARED FILES

router.post("/shared", async (req,res)=>{
  console.log(req.body);
    const {userId} = req.body;
    if(!userId){
      res.json({success:false,message:"userId required"});
      return;
    }
    try{
      const sharedFiles = await ShareFile.find({userId:userId});
      res.status(200).json({success:true,data:sharedFiles});
    }
    catch(e){
      console.log(e.message());
    }
});

export default router;
