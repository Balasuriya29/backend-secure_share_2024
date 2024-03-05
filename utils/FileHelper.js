import ShareFile from "../models/ShareFileModel.js";

export const validateFileId = (fileId) => {

    //TODO: Check if the fileId exists in db

    if(fileId.length == 0){
        return false;
    }
    return true;
}

export const createShareModel = async (shareAttributes) => {
    try{
        const ShareModel = new ShareFile(shareAttributes);
        const result = await ShareModel.save();
        console.log('-------ShareModel Result-------');
        console.log(result);
        return ({success:true,data:{shareId:result._id}})
    }
    catch(e){
        console.log('-------Error while creating a document in share model---------');
        console.log(e);
        return ({success:false,message:e.message});
    }
}

export const getSharedFile = async (fileId) => {
    try{
        const sharedFile = await ShareFile.findById(fileId);
        if(!sharedFile){
            return ({success:false,message:"File not found"});
        }
        console.log('-------Fetched shared file-----');
        return ({success:true,data:sharedFile});
    }
    catch(e){
        console.log('-------Error while getting shareType of a file---------');
        console.log(e);
        return ({success:false,message:e.message});
    }
}


export const isShareTypeContainsTime = (shareTypes) => {
    const isShareTypeTime = shareTypes.find((shareType)=>shareType === 'time');
    return (isShareTypeTime)?true:false;
}

export const fetchExpirationTimeOfFile = async (shareId) => {
    
}