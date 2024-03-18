import mongoose, { Schema, model } from "mongoose";

const shareFile = new mongoose.Schema({
    fileId : String,
    totalChunks : Number,
    userId : {type:mongoose.SchemaTypes.ObjectId,ref:'User'},
    shareTypes : Array,
    shareAttributes : Object,
});

const ShareFile = mongoose.model("Share",shareFile,"Share");

export default ShareFile;