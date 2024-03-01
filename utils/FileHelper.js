export const validateFileId = (fileId) => {

    //TODO: Check if the fileId exists in db

    if(fileId.length == 0){
        return false;
    }
    return true;
}