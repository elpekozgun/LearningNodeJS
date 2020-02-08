/*jshint esversion: 6 */

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Validation = require("./validation");

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


// const genres = [{id: 1, type: "horror"},
//                 {id: 2, type: "thriller"},
//                 {id: 3, type: "comedy"},
//                 {id: 4, type: "romance"},
//                 {id: 5, type: "animation",}];



router.get(
    "/",
    async (req, res) => 
    {
        const genres = await Genre.find().sort("name");
        res.send(genres);
    }
);

router.get(
    "/:id",
    async (req, res) => 
    {
        const genre = await Genre.findById(req.params.id);
        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }
        res.send(genre);
    }
);

router.post(
    "/",
    async (req, res) => {

        if (Validation.validateGenre(req, res)) {
            let genre = new Genre
            (
                {
                    type: req.body.type
                }
            )
            await genre.save();

            res.send(genre);
        }
    }
);

router.put(
    "/:id",
    async (req, res) => {

        if (!Validation.validateGenre(req, res)) {
          return res;
        }

        const genre = await Genre.findByIdAndUpdate(
            req.params.id,
            {
                type: req.body.type    
            }, 
            {new:true}
        );

        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }

        res.send(genre);
    }
);

router.delete(
    "/:id",
    async (req, res) => {

        const genre = await Genre.findByIdAndRemove
        (
            req.params.id
        );

        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }
        res.send(genre);
    }
);


module.exports = router;