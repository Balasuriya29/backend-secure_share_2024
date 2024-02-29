export default function (fileAccess,socket,fileId) {
    if(fileAccess){
        socket.emit('fileStatus',{fileId:fileId,staus:"Open",showFile:true});
    }
    else{
        socket.emit('fileStatus',{fileId:fileId,staus:"Closed",showFile:false});
    }
}