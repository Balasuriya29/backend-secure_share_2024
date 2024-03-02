const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const router = express.Router();

const { chunk, chunkSchema } = require("../models/chunkModel");
const { file, fileSchema } = require("../models/fileModel");

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

module.exports = router;
