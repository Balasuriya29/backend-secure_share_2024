import axios from "axios";
import express from "express";
import QueryString from "qs";
import jwt from "jsonwebtoken";
import { addUser, createUser, fetchUserByEmail, generateAccessToken } from "../utils.js";
import User from "../models/User.js";
import crypto from "crypto";
import authenticateUser from "../middlewares/auth.js";
const authRouter = express();


authRouter.get("/callback", async (req,res)=>{

    const queryParams = {
        client_id : process.env.GOOGLE_CLIENT_ID,
        client_secret : process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri : process.env.GOOGLE_REDIRECT_URL,
        response_type : 'code',
        code : req.query.code,
        grant_type : 'authorization_code'
    }
    const tokenResult = await axios.post(`${process.env.GOOGLE_TOKEN_ENDPOINT}?${QueryString.stringify(queryParams)}`);
    if(tokenResult.data){
        console.log(tokenResult.data);
        const userDetails = jwt.decode(tokenResult.data["id_token"]);
        const user = await fetchUserByEmail(userDetails["email"]);
        if(user.length === 0){
            const addUserResult = await addUser(userDetails);
            if(addUserResult.success)
                userDetails["userId"] = addUserResult.data["_id"];
            console.log(addUserResult.message);
        }
        res.cookie('userdata',JSON.stringify(userDetails));
        res.cookie('token',generateAccessToken(userDetails),{
        });
        res.redirect(`${process.env.FRONTEND_URL}`);
        return;
    }
    else{
        console.log("Error");
    }
    
});

authRouter.post("/verifyToken",async (req,res)=>{
    if(!req.cookies.token){
        return res.json(({success:false,message:"Unauthorized access. Token required"}));
    }
    try{
        jwt.verify(req.cookies.token,process.env.JWT_SECRET_KEY);
        res.status(200).json({success:true,message:"Verification success"});
    }
    catch(e){
        res.status(400).json({success:false,message:"Unauthorized access"});
    }
});

authRouter.post("/login", async (req,res)=>{
    const {username} = req.body;

    try{
        const user = await User.findOne({username});

        let userDetails = {username};

        if(!user){
            const createUserResponse = await createUser(username);
        
            if(!createUserResponse.success){
                res.json(createUserResponse);
                return;
            }
            
            userDetails["userId"] = createUserResponse.data["_id"];

            res.status(200).json({success:true,isNewUser:true,access_token:generateAccessToken(userDetails),userDetails:JSON.stringify(userDetails)});
            return;
        }

        userDetails["userId"] = user._id;

        res.status(200).json({success:true,isNewUser:(user.password)?false:true,access_token:generateAccessToken(userDetails),userDetails:JSON.stringify(userDetails)});
        return;
    }
    catch(e){
        console.log("-------Error while login---------",req.body);
        res.json({success:false,message:e.message});
    }
});

authRouter.post("/savePassword", authenticateUser ,async (req,res)=>{

    const {username,password} = req.body;

    try{
        const user = await User.findOne({username});

        if(!user){
            res.json({success:false,message:"User not found"});
            return;
        }

        // Need to hash the password before storing

        user.password = password;

        await user.save();

        res.status(200).json({success:true,message:"Password saved successfully"});

    }
    catch(e){
        console.log("-------Error while saving password---------",req.body);
        res.json({success:false,message:e.message});
    }

})

authRouter.post("/checkPassword", authenticateUser ,async (req,res)=>{
    const {username,password} = req.body;

    try{
        const user = await User.findOne({username});

        if(!user){
            res.json({success:false,message:"User not found"});
            return;
        }

        // Need to hash the password before comparing

        if(user.password === password){
            res.status(200).json({success:true,message:"Password matched"});
            return;
        }

        res.status(400).json({success:false,message:"Password mismatch"});

    }
    catch(e){
        console.log("-------Error while checking password---------",req.body);
        res.json({success:false,message:e.message});
    }

})

export default authRouter;