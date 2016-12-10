const config = require('../config/main');
const jwt = require('jsonwebtoken');
const redis = require('redis').createClient();

// Sign in - generate token
exports.signIn = function(req,res) {
	var token_expires = Date.now() + 2630000000; // Token validity is one month
	//Generate token
	var token = jwt.sign({ expires: token_expires}, config.secret);

	//Store token in redis
	if(req.user){
		var data = {
			user_id: req.user._id
		};
		redis.set(token, JSON.stringify(data))
		//Return the token
		res.send({
			status: "Success",
			token: token
		})
	}
	else {
		return res.send({ status: "failure", message: "No user found"});
	}
	
}

// Is authenticated
exports.isAuthenticated = function(req,res,next) {

	var token = req.headers['x-auth-token'];
	if(!token) {
		res.status(401);
		res.json({ "error": "Unauthenticated Request" });
	}
	else {

		jwt.verify(token, config.secret, function(err, data) {
			if(err) {
				res.status(401);
				res.json({ "error": "Invalid token"});
			}
			else {
		    	// Check for expiration of the token
		    	if(data.expires > Date.now()) {
		    		redis.get(token, function(err,reply) {
		    			if(reply) {
		    				var data = JSON.parse(reply)
		    				req.user = data.user;
		    				req.token = token;
		    				next();
		    			}
		    			else {
		    				res.status(401);
		    				res.json({ "error": "Invalid token" });
		    			}
		    		})
		    	}
		    	else {
		    		res.status(401);
		    		res.json({ "error": "Token Expired"});
		    	}
		    }
		});
	}
}