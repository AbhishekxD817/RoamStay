import Joi from "joi"

export const ListingSchema = Joi.object({
    title: Joi.string().required(),
    description:Joi.string().required() ,
    location:Joi.string().required() ,
    price: Joi.number().required().min(0).integer(),
    country:Joi.string().required() 
})

export const ReviewSchema = Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5)
})