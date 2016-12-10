"use strict";

const user = require('./controllers/userController');
const session = require('../lib/session');

module.exports = function(app){

	//User signup and login routes
	app.post('/user/signup',user.create);
	app.post('/user/login',user.login,session.signIn);
	app.get('/user/checkAuth',session.isAuthenticated,user.dummy);
}