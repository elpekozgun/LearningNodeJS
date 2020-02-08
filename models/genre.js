
const mongoose = require("mongoose");
const Joi = require("joi");

const Genre = mongoose.model("Genre",  new mongoose.Schema
(
    {
        type:
        {
            type:String,
            required: true,
            minlength:5,
            maxlength:30
        }
    }
));


function validateGenre(req, res) {
  const schema = Joi.object().keys({
    type: Joi.string()
      .min(3)
      .max(30)
      .required()
  });

  const result = Joi.validate(req.body, schema);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }
  return true;
}


module.exports.Genre = Genre;
module.exports.validate = validateGenre;