export default function (fileAccess,socket) {
    if(fileAccess){
        socket.emit('fileStatus',{staus:"Open",showFile:true});
    }
    else{
        socket.emit('fileStatus',{staus:"Closed",showFile:false});
    }
}