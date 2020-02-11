/*jshint esversion: 6 */

const {Rental, validate} = require("../models/rental");
const { Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const {Customer} = require("../models/customer");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

Fawn.init(mongoose);

router.get(
    "/",
    async (req, res) => 
    {
        const rentals = await Rental.find().sort("-dateOut");
        res.send(rentals);
    }
);

router.get(
    "/:id",
    async (req, res) => 
    {
        const Rental = await Rental.findById(req.params.id);
        if (!Rental)
        {
            //404 cant find
            return res.status(404).send(`requested Rental "${req.params.id}" cant be found`);
        }
        res.send(Rental);
    }
);

router.post(
    "/",
    async (req, res) =>
    {

        if (validate(req, res))
        {
            const customer = await Customer.findById(req.body.customerId);
            if (!customer)
            {
                return res.status(400).send("invalid customer");
            }

            const movie = await Movie.findById(req.body.movieId);
            if (!movie)
            {
                return res.status(400).send("invalid movie");
            }

            if(movie.numberInStock === 0)
            {
                return res.status(400).send("movie no longer in stock");
            }

            let rental = new Rental
                (
                    {
                        customer:
                        {
                            _id: customer._id,
                            name: customer.name,
                            phone: customer.phone
                        },
                        movie:
                        {
                            _id: movie._id,
                            title: movie.title,
                            dailyRentalRate: movie.dailyRentalRate
                        }
                    }
                )

            //await Rental.save();
            //movie.numberInStock--;      // THERE ARE 2 .save() calls here, we need a mechanism like transaction to guarantee that they both execute or rollback.
            //movie.save();

            //We use Fawn to make above 3 lines work 

            try 
            {
                new Fawn.Task()
                    .save("rentals", rental)
                    .update(
                    "movies",
                    { _id: movie._id },
                    {
                        $inc: { numberInStock: -1 }
                    }
                    )
                    .run();
                    res.send(rental);
            } 
            catch (ex) 
            {
                res.status(500).send("something failed during process");
            }

        }
    }
);

router.put(
    "/:id",
    async (req, res) =>
    {

        if (!validate(req, res))
        {
            return res;
        }

        const genre = await Genre.findById(req.body.genreId);
        if (!genre)
        {
            return res.status(400).send("invalid genre");
        }

        const Rental = await Rental.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                // recall that we dont need to keep every single property of a subdocument
                genre:
                {
                    _id: genre._id,
                    type: genre.type
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            },
            { new: true }
        );

        if (!Rental)
        {
            //404 cant find
            return res.status(404).send(`requested Rental "${req.params.id}" cant be found`);
        }

        res.send(Rental);
    }
);

router.delete(
    "/:id",
    async (req, res) =>
    {

        const Rental = await Rental.findByIdAndRemove
            (
                req.params.id
            );

        if (!Rental)
        {
            //404 cant find
            return res.status(404).send(`requested Rental "${req.params.id}" cant be found`);
        }
        res.send(Rental);
    }
);

module.exports = router;