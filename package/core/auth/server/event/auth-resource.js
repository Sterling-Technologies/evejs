module.exports = function(controller, token) {
	// Search filter
	var filter = { 'auth.token' : token };

	// Find user with the
	// given user token
	controller
	.auth()
	.store()
	.find(filter, function(error, user) {
		// If there is an error
		if(error) {
			// trigger error event
			return controller.trigger('auth-resource-error', 
				   { message : 'An error occured while authenticating request' });
		}

		// If there is no record
		if(user.length == 0) {
			// trigger error event
			return controller.trigger('auth-resource-error', 
				   { message : 'Invalid Username or Password' });
		}

		// If user exists and token is not undefined
		if(user[0].auth !== undefined && user[0].auth.token !== undefined &&
		   user[0].auth.token !== token) {
		   	// trigger error event
			return controller.trigger('auth-resource-error', 
				   { message : 'Invalid Username or Password' });
		}

		// Trigger resource success event,
		// if there is no error
		return controller.trigger('auth-resource-success');
	});
};