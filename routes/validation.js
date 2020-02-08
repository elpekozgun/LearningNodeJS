
const Joi = require("joi");

function validateGenre(req, res) 
{
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



function reOrderIDs(genres) {
  for (let i = 0; i < genres.length; i++) {
    genres[i].id = i + 1;
  }
  return;
}


module.exports = { validateGenre: validateGenre,validateCustomer: validateCustomer,  reOrderIDs: reOrderIDs };