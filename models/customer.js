

const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model("Customer",  new mongoose.Schema
(
    {
        isGold:
        {
            type:Boolean,
            required: true,
            default:false
        },
        name:
        {
            type:String,
            required:true,
            minlength: 5,
            maxlength: 100
        },
        phone:
        {
            type:Number,
            required:true,
        }
    }
));


function validateCustomer(req, res) {
  const schema = Joi.object().keys(
    {
        name: Joi.string()
            .min(5)
            .max(100)
            .required(),
        phone: Joi.number(),
        isGold: Joi.boolean()
    }
  );

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  return true;
} 

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;