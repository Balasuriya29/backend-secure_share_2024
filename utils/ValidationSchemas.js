import Joi from "joi";


export const getFileLinkSchema = Joi.object({
    userId : Joi.string().required(), //TODO: Need to update
    fileId : Joi.string().required(),
    shareTypes : Joi.array().required().min(1),
    totalChunks : Joi.number(),
    shareAttributes : Joi.object().required(),
    connections : Joi.optional(),
    // shareAttributes: Joi.object({
    //     time: Joi.object({
    //         expiration:Joi.string()
    //     }).when('shareType',{is:"time",then:Joi.required()}),
    //     geoFence: Joi.object({
    //         latitude: Joi.number().required(),
    //         longitude: Joi.number().required()
    //     }).when('shareType',{is:"geoFence",then:Joi.required()})
    // }).min(1).required()
});


export const validateShareAttributes = (shareTypes,shareAttributes) => {
    console.log('----shareTypes------',shareTypes);
    console.log('-----shareAttributes------',shareAttributes);

    let shareAttributesCounter = shareTypes.length;

    shareTypes.map((shareType)=>{
        if(!shareAttributes[shareType]){
            return false;
        }

        if(shareType === 'time'){
            if(shareAttributes[shareType]["expiration"]){
                shareAttributesCounter-=1;
            }
            else
                return false;
        }
        else if(shareType === 'geoFence'){
            if(shareAttributes[shareType]['latitude'] && shareAttributes[shareType]['longitude'] && shareAttributes[shareType]['radius']){
                shareAttributesCounter-=1;
            }
            else
                return false;
        }
        else if(shareType === "ipControl"){
            if(shareAttributes[shareType]['noOfIPs']){
                shareAttributesCounter-=1;
            }
            else
                return false;
        }
    })
    if(shareAttributesCounter === 0){
        return true;
    }
    return false;
}

