"use strict";

const User = require('../models').User;
const bcrypt = require('bcrypt-nodejs');

//Create user
exports.create = function(req,res){
	var user = {
		'email': req.body.email || req.query.email,
		'password': req.body.password || req.query.password
	};

	//Encrypt the password using Bcrypt
	user.password = bcrypt.hashSync(user.password);

	//save in DB
	User(user).save(function(err,newUser){
		if(err){
			console.log(err);
			res.status(500);
			res.send(err);
		}
		else {
			res.status(200);
			res.send({ status: "success", message: "User created successfully" });
		}
	});
};

// Login
exports.login = function(req,res,next) {
	var email = req.body.email || req.query.email;
	var password = req.body.password || req.query.password;

	//Query to DB to find the user
	User.findOne({ email: email},function(err,user){
		if(err){
			console.log(err);
			res.status(500);
			res.send(err);
		} 
		else if(user){
			var isPassCorrect = bcrypt.compareSync(password,user.password);
			if(isPassCorrect){
				req.user = user;
				next();
			} else {
				res.status(400);
				res.send({ status: "failure", message: "Incorrect password"});
			}
		} else {
			res.status(404);
			res.send({ status: "failure", message: "No user found"});
		}
	});
};

//Check if auth works
exports.dummy = function(req,res){
	res.send({ status: true, message: "Successfully authenticated"});
};