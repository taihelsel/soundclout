//imports
require('dotenv').config();
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const app = express();
//config
const port =  process.env.PORT;
const dbName = process.env.DB_NAME || "soundclout";
const dbUrl = process.env.MONGODB_URI || "mongodb://localhost/";

//mongoose.connect( dbUrl + dbName, { useNewUrlParser: true });//mongo stuff
//middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
//server logging
app.use(require("morgan")("dev"));
//routes
app.use("/songdata", require("./routes/songdata"));
//sending build
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
});
//setting port & starting server
const server = app.listen(port, () => {
    console.log("Server started on port", port);
});
module.exports = server;