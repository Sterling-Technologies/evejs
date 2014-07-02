module.exports = function(controller, query) {
	// Load up eden sequence
	var sequence = controller.eden.load('sequence');
	// Load up eden string
	var string   = controller.eden.load('string');

	sequence
	// Check if user exists
	.then(function(next) {
		// Search filter
		var filter = { slug : query.username, password : string.md5(query.password) };

		// Search the user
		// if exists
		controller
		.auth()
		.store()
		.find(filter, function(error, user) {
			// If there is an error
			if(error) {
				// trigger error event
				return controller.trigger('auth-access-error',
					   { message : 'An error occured, please try again' });
				
			}

			// If user does not exists
			if(user.length == 0) {
				// trigger error event
				return controller.trigger('auth-access-error',
					  { message : 'Invalid Username or Password' });
			}

			// Proceed to next sequence
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
					// If there is an error
					if(error) {
						// trigger error event
						return controller.trigger('auth-access-error',
							   { message : 'An error occured, please try again' });
					}

					// If there is no user record
					if(user.length == 0) {
						// trigger error event
						return controller.trigger('auth-access-success',
							   { message : 'Invalid Username or Password' });
					}

					// If there is no error, trigger
					// success event an passed in user
					// token
					return controller.trigger('auth-access-success', { token : user.auth.token });
				});
			}

			// If user exist, and it has token
			// already, trigger success event
			// and passed in user token
			return controller.trigger('auth-access-success', { token : user.auth.token });
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
			// If there is an error
			if(error) {
				// trigger error event
				return controller.trigger('auth-access-error',
					   { message : 'An error occured, please try again' });
			}

			// If there is no error, trigger success event
			// and passed in user token
			return controller.trigger('auth-access-success',
				   { token : user.auth.token });
		});
	});
};