import jwt from "jsonwebtoken";

const authenticateUser = async function (req, res, next) {

    console.log("-------in authenticate user-----");
    console.log(req.headers.authorization);

    const token = req.headers.authorization;

    if(!token){
        res.json({success:false,message:"Unauthorized"});
        return;
    }
    try{
        jwt.verify(token,process.env.JWT_SECRET_KEY);
        const userDetails = jwt.decode(token);
        const {username,userId} = userDetails;
        req.body.username = username
        req.body.userId = userId
    }
    catch(e){
        res.json({success:false,message:"Unauthorized. Invalid token"});
        return;
    }
    next();
}

export default authenticateUser;