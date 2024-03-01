import Joi from "joi";


export const getFileLinkSchema = Joi.object({
    userId : Joi.string().required(), //TODO: Need to update
    fileId : Joi.string().required(),
    shareType : Joi.string().required(),
    shareAttributes: Joi.object({
        time: Joi.object({
            expiration:Joi.string()
        }).when('shareType',{is:"time",then:Joi.required()}),
        geoFence: Joi.object({
            latitude: Joi.number().required(),
            longitude: Joi.number().required()
        }).when('shareType',{is:"geoFence",then:Joi.required()})
    }).required()
});

