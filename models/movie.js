const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema }= require("./genre");

const Movie = mongoose.model("Movie",  new mongoose.Schema
(
    {
        title:
        {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 255
        },
        genre:
        {
            type: genreSchema,
            required: true,
        },
        numberInStock:
        {
            type:Number,
            required:true,
            min:0,
            max:255
        },
        dailyRentalRate:
        {
            type:Number,
            required:true,
            min: 0,
            max: 255
        }
    }
));


function validateMovie(req, res) {
    const schema = Joi.object().keys(
    {
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required()
    }
    );

    const result = Joi.validate(req.body, schema);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    return true;
} 

module.exports.Movie = Movie;
module.exports.validate = validateMovie;