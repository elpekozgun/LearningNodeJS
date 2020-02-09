/*jshint esversion: 6 */

const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();


router.get(
    "/",
    async (req, res) => 
    {
        const movies = await Movie.find().sort("title");
        res.send(movies);
    }
);

router.get(
    "/:id",
    async (req, res) => 
    {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            //404 cant find
            return res.status(404).send(`requested movie "${req.params.id}" cant be found`);
        }
        res.send(movie);
    }
);

router.post(
    "/",
    async (req, res) => {

        if (validate(req, res)) {

            const genre = await Genre.findById(req.body.genreId);
            if(!genre)
            {
                return res.status(400).send("invalid genre");
            }

            let movie = new Movie
            (
                {
                    title: req.body.title,
                    genre: 
                    {
                        _id: genre._id,
                        type: genre.type
                    },
                    numberInStock: req.body.numberInStock,
                    dailyRentalRate: req.body.dailyRentalRate
                }
            )
            await movie.save();

            res.send(movie);
        }
    }
);

router.put(
    "/:id",
    async (req, res) => {

        if (!validate(req, res)) {
          return res;
        }

        const genre = await Genre.findById(req.body.genreId);
        if (!genre)
        {
            return res.status(400).send("invalid genre");
        }

        const movie = await Movie.findByIdAndUpdate(
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
            {new:true}
        );

        if (!movie) {
            //404 cant find
            return res.status(404).send(`requested movie "${req.params.id}" cant be found`);
        }

        res.send(movie);
    }
);

router.delete(
    "/:id",
    async (req, res) => {

        const movie = await Movie.findByIdAndRemove
        (
            req.params.id
        );

        if (!movie) {
            //404 cant find
            return res.status(404).send(`requested movie "${req.params.id}" cant be found`);
        }
        res.send(movie);
    }
);

module.exports = router;