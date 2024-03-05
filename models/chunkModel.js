//Required Packages
import { Schema, model } from "mongoose";

//Schema Section
const chunkSchema = new Schema({
  fileId: String,
  data: Buffer,
});

//Model Section
const chunk = model("newChunk", chunkSchema, "chunks");

const _chunk = chunk;
export { _chunk as chunk };
const _chunkSchema = chunkSchema;
export { _chunkSchema as chunkSchema };
