import {OAuth2Client}  from 'google-auth-library';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import User from './models/User.js';

const client = new OAuth2Client();
export async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload
}

export function generateAccessToken (userDetails) {
  return jwt.sign(userDetails,process.env.JWT_SECRET_KEY,);
}   

export function verifyAccessToken (token) {
  console.log(jwt.verify(token));
}

export async function connectToMongoDB () {
  console.log("Connecting to MongoDB");
  console.log(process.env.MONGODB_CONNECTION_STRING);
  await mongoose.connect(process.env.MONGODB_CONNECTION_STRING,)
  .then((res)=>{
    console.log("Connected to MongoDB");
  })
  .catch((e)=>{
    console.log(e);
  })
}

export async function checkUserAlreadyExists(email){
  const user = await User.find({email});
  if(user){
    return true;
  }
  return false;

}

export async function addUser({email,name,picture}){
  const user = new User({email,name,profile_picture:picture})
  try{
    const result = await user.save();
    if(result){
      return ({success:true,message:"User added successfully"})
    }
    return ({success:false,message:"Failed adding user"})
  }
  catch(e){
    return ({success:false,message:e.message})
  }
  
}
