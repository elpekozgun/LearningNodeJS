/*jshint esversion: 6 */

const express = require("express");
const router = express.Router();
const Validation = require("./validation");


const genres = [{id: 1, type: "horror"},
                {id: 2, type: "thriller"},
                {id: 3, type: "comedy"},
                {id: 4, type: "romance"},
                {id: 5, type: "animation",}];

router.get(
    "/",
    (req, res) => {
        res.send(genres);
    }
);

router.get(
    "/:id",
    (req, res) => {
        const genre = genres.find(x => x.id === parseInt(req.params.id));
        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }
        res.send(genre);
    }
);

router.post(
    "/",
    (req, res) => {

        if (Validation.validate(req, res)) {
            const genre = {
                id: genres.length + 1,
                type: req.body.type
            };
            genres.push(genre);
            res.send(genre);
        }
    }
);

router.put(
    "/:id",
    (req, res) => {
        let genre = genres.find(x => x.id === parseInt(req.params.id));
        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }

        if (Validation.validate(req, res)) {
            genre.type = req.body.type;
            res.send(genre);
        }
    }
);

router.delete(
    "/:id",
    (req, res) => {
        const genre = genres.find(x => x.id === parseInt(req.params.id));
        if (!genre) {
            //404 cant find
            return res.status(404).send(`requested genre "${req.params.id}" cant be found`);
        }

        const index = genres.indexOf(genre);
        genres.splice(index, 1);
        Validation.reOrderIDs(genres);
        res.send(genre);
    }
);


module.exports = router;