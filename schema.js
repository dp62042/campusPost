const Joi = require('joi');

module.exports.postSchema  = Joi.object({
    post : Joi.object({
        title : Joi.string().required(),
        category : Joi.string().required(),
        description : Joi.string().required(),
        img: Joi.any(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
       rating: Joi.number().required().min(1).max(5),
       comment: Joi.string().required() 
    }).required()
});