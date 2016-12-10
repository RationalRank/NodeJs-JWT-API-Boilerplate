"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Schema 
const User = mongoose.model('User',{
	email : { type: String, required: true },
	password : { type:String, required:true }
});

module.exports = {
	User : User
}