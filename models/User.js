import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    profile_picture:String,
});

const User = mongoose.model("User",UserSchema,"User");

export default User;