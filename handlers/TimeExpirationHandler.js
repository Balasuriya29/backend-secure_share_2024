import returnTimeExpirationResponse from "../utils/returnTimeExpirationResponse.js";

const TimeExpirationHandler = (fileId,socket) => {
    //Need to fetch the expiration time of the file from DB
    const fileExpirationTime = new Date(Date.now() + ( 10 * 1000));
    const expirationIntervalId = setInterval(()=>{
        if(Date.now() <= fileExpirationTime){
            console.log("----------User can access the file--------");
            returnTimeExpirationResponse(true,socket,fileId);
        }
        else{
            returnTimeExpirationResponse(false,socket,fileId);
            clearInterval(expirationIntervalId);
        }
    },1000);
}

export default TimeExpirationHandler;