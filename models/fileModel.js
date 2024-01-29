//Required Packages
const mongoose = require("mongoose");

//Schema Section
const fileSchema = new mongoose.Schema({
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
const file = mongoose.model("newFile", fileSchema, "files");

module.exports.file = file;
module.exports.fileSchema = fileSchema;
