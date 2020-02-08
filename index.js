/*jshint esversion: 6 */

const mongoose = require("mongoose");

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

const express = require("express");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const home = require("./routes/home");

const app = express();
app.use(express.json());

app.use("/api/genres",genres);
app.use("/api/customers", customers);
app.use("/", home);

//PORT
const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`listening on port ${port}`); });