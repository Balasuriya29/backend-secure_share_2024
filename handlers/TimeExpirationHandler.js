import returnTimeExpirationResponse from "../utils/returnTimeExpirationResponse.js";

const TimeExpirationHandler = (sharedFile,socket) => {

    const fileExpirationTime = Number.parseInt(sharedFile["shareAttributes"]["time"]["expiration"]);

    const expirationIntervalId = setInterval(()=>{
        const currentTime = new Date().getTime();
        console.log('-----File expiration time-------',fileExpirationTime);
        console.log('-----currentTime-----',currentTime);
        if(currentTime <= fileExpirationTime){
            console.log("----------User can access the file--------");
            console.log("----------SHARE ID-------",sharedFile._id);
            returnTimeExpirationResponse(sharedFile,true,socket);
        }
        else{
            console.log('----File share expired------');
            returnTimeExpirationResponse(sharedFile,false,socket);
            clearInterval(expirationIntervalId);
        }
    },1000);
}

export default TimeExpirationHandler;