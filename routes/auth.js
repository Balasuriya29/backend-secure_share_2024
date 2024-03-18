import axios from "axios";
import express from "express";
import QueryString from "qs";
import jwt from "jsonwebtoken";
import { addUser, fetchUserByEmail, generateAccessToken } from "../utils.js";
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
})

export default authRouter;