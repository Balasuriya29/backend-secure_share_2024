export default function (sharedFile,fileAccess,socket) {
    if(fileAccess){
        socket.emit('fileStatus',{status:"Open",fileId:sharedFile.fileId,totalChunks:sharedFile.totalChunks,showFile:true});
    }
    else{
        socket.emit('fileStatus',{status:"Closed",showFile:false});
    }
}