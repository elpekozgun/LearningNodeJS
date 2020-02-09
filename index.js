/*jshint esversion: 6 */

const mongoose = require("mongoose");
const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const home = require("./routes/home");
const app = express();


mongoose.connect("mongodb://localhost/vidlyApp",
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
    {
        console.log("connected to mongoDB");
    })
    .catch(err =>
    {
        console.error("could not connect to database", err);
    });


const url = "http://vidly.com";


app.use(express.json());

app.use("/api/genres",genres);
app.use("/api/customers", customers);
app.use("/api/movies",movies);
app.use("/", home);

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`listening on port ${port}`); });