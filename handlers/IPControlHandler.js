import ShareFile from "../models/ShareFileModel.js";

export default async function (socket,sharedFile) {
     
    console.log("------Share type contains ipControl-------");

    let allowedNoOfIPs = Number.parseInt(sharedFile.shareAttributes["ipControl"]["noOfIPs"]);
    let connections = sharedFile.connections;
    let currentIP = socket.handshake.address;

    // Check if current ip already exists in the connections
    const isIPAlreadyPushed = connections.find((connection)=>connection["ipAddress"]==currentIP);

    console.log(isIPAlreadyPushed);

    // If ip is not present 
    if(!isIPAlreadyPushed){
        console.log("----ip not exists-----");
        // Check if we can add this ip to the connections
       
        if((connections.length+1) > allowedNoOfIPs){
          console.log("-----no of ips exceeded----");
          console.log("-----sending error message-----");
          return ({allowAccess:false,message:"No of users exceeded"});
        }
        else{
          // If space available add it
          console.log("-----pushed ip to connections-----");
          const result = await ShareFile.findOneAndUpdate({_id:sharedFile.id},{"$push":{"connections":{ipAddress:currentIP,socketId:socket.id}}})
        }
    }

    return ({allowAccess:true});
  
}