//Required Packages
import { Schema, model } from "mongoose";

//Schema Section
const fileSchema = new Schema({
  fileId: String,
  name: String,
  size: String,
  type: String,
  created_at: Number,
  userId: String,
  totalChunks: Number,
  isViewAble: { type: Boolean, default: false },
});

//Model Section
const file = model("newFile", fileSchema, "files");

const _file = file;
export { _file as file };
const _fileSchema = fileSchema;
export { _fileSchema as fileSchema };
