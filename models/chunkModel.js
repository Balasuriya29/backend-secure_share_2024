//Required Packages
const mongoose = require("mongoose");

//Schema Section
const chunkSchema = new mongoose.Schema({
  fileId: String,
  data: Buffer,
});

//Model Section
const chunk = mongoose.model("newChunk", chunkSchema, "chunks");

module.exports.chunk = chunk;
module.exports.chunkSchema = chunkSchema;
