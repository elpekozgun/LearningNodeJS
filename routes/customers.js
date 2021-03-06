
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const {Customer, validate} = require("../models/customer");

router.get(
    "/",
    async (req, res) => 
    {
        const customers = await Customer.find().sort("name");
        res.send(customers);
    }
);

router.get(
    "/:id",
    async (req, res) => 
    {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            //404 cant find
            return res.status(404).send(`requested customer "${req.params.id}" cant be found`);
        }
        res.send(customer);
    }
);

router.post(
    "/",
    async (req, res) => {

        if (validate(req, res)) {
            let customer = new Customer
            (
                {
                    isGold: req.body.isGold,
                    name: req.body.name,
                    phone: req.body.phone
                }
            )
            await customer.save();

            res.send(customer);
        }
    }
);

router.put(
    "/:id",
    async (req, res) => {

        if (!validate(req, res)) {
          return res;
        }

        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            {
                isGold: req.body.isGold,
                name: req.body.name,
                phone: req.body.phone
            }, 
            {new:true}
        );

        if (!customer) {
            //404 cant find
            return res.status(404).send(`requested customer "${req.params.id}" cant be found`);
        }

        res.send(customer);
    }
);

router.delete(
    "/:id",
    async (req, res) => {

        const customer = await Customer.findByIdAndRemove
        (
            req.params.id
        );

        if (!customer) {
            //404 cant find
            return res.status(404).send(`requested customer "${req.params.id}" cant be found`);
        }
        res.send(customer);
    }
);


module.exports = router;

