"use strict";

var express = require("express");
var app = express();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");
var config = require('./config/main');
var morgan = require('morgan');

//Set port on which server runs
app.set('port', process.env.port || config.port);

//Configure bodyparser
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());

//Setup morgan for logging to console
app.use(morgan('combined'))
app.set('superSecret', config.secret); // secret variable

//Setting up DB
mongoose.connect(config.DB,function(err){
	if(err){
		throw err;
	} else {
		console.log('Successfully connected to the database');
	}
});

const router = require('./app/routes')(app);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

//Listen for calls
app.listen(config.PORT, function () {
  console.log('Server listening on port ' + config.PORT );
});