const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi); //this reuire returns a function, that takes "Joi" as a parameter

const Rental = mongoose.model("Rental", new mongoose.Schema
    (
        {
            // we redefined customer here unlike the one in customer.js, because in reality we may have a lot of fields in customer which we wont need here.
            customer:
            {
                type: new mongoose.Schema(
                    {
                        name:
                        {
                            type: String,
                            required: true,
                            minlength: 5,
                            maxlength: 50
                        },
                        isGold:
                        {
                            type:Boolean,
                            default:false
                        },
                        phone:
                        {
                            type:Number,
                            required: true
                        }
                    }
                )
            },
            movie:
            {
                type: new mongoose.Schema(
                    {
                        title:
                        {
                            type: String,
                            required: true,
                            trim: true,
                            minlength: 5,
                            maxlength: 255
                        },
                        dailyRentalRate:
                        {
                            type: Number,
                            required: true,
                            min: 0,
                            max: 255
                        }
                    }
                )
            },
            dateOut:
            {
                type: Date,
                required: true,
                default: Date.now
            },
            dateReturned:
            {
                type: Date,
            },
            rentalFee:
            {
                type:Number,
                min:0
            }
        }
    ));


function validateRental(req, res)
{
    const schema = Joi.object().keys(
        {
            customerId: Joi.objectId().required(),
            movieId: Joi.objectId().required()
        }
    );

    const result = Joi.validate(req.body, schema);

    if (result.error)
    {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    return true;
}

module.exports.Rental = Rental;
module.exports.validate = validateRental;