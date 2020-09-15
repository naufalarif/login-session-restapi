const express = require('express');
const bodyParser = require('body-parser');
const user = require("./routes/user");
const InitiateMongoServer = require('./config/db');

// Initiate Mongo Server
InitiateMongoServer();

const app = express();

// Port
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
	res.json({ message: "Connected to database" });
});

/** 
* Router Middleware
* Router - /user/*
* Method - *
*/
app.use("/user", user);



app.listen(PORT, (req, res) => {
	console.log(`Server Started at PORT ${PORT}`);
});
