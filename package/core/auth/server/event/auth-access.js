module.exports = function(controller, query) {
	// Load up eden sequence
	var sequence = controller.eden.load('sequence');
	var string   = controller.eden.load('string');

	sequence
	// Check if user exists
	.then(function(next) {
		var filter = { slug : query.username, password : string.md5(query.password) };

		controller
		.auth()
		.store()
		.find(filter, function(error, user) {
			if(error) {
				controller.trigger('auth-access-error',
					'An error occured, please try again');
				return;
			}

			if(user.length == 0) {
				controller.trigger('auth-access-error',
					'Invalid Username or Password');
				return;
			}

			next(user[0]);
		});
	})
	// Check if user has a token
	// already, if auth object
	// does not exist, create one
	.then(function(user, next) {
		if(('auth' in user) && user.auth.token !== undefined) {
			if(user.auth.active !== undefined && user.auth.active == false) {
				// Update User auth token
				controller
				.auth()
				.store()
				.update(user._id, { 'auth.active' : true }, function(error, user) {
					if(error) {
						controller.trigger('auth-access-error',
							'An error occured, please try again');
						return;
					}

					if(user.length == 0) {
						controller.trigger('auth-access-success',
							'Invalid Username or Password');
						return;
					}

					controller.trigger('auth-access-success', user.auth.token);
				});
			}

			controller.trigger('auth-access-success', user.auth.token);
			return;
		}

		// Create new access token
		// for the user, we can just
		// use id+slug+password for
		// hmac signature
		var signature = user._id + user.slug + user.password;
		// and user id for hmac key
		var key 	  = user._id.toString();
		// Load up eden string module
		var string    = controller.eden.load('string');
		// Create hmac token with sha-1 algorithm and hex digest
		var hmac      = string.hmac(signature, key, 'sha1', 'hex');
		// Fields to be updated
		var update = {
			'auth.active'  : true,
			'auth.token'   : hmac
		};

		// Create Access Token for
		// the user
		controller
		.auth()
		.store()
		.update(user._id, update, function(error, user) {
			if(error) {
				controller.trigger('auth-access-error',
					'An error occured, please try again');
				return;
			}

			controller.trigger('auth-access-success',
				user.auth.token);
		});
	});
};