module.exports = function(controller, token) {
	var filter = { 'auth.token' : token };

	controller
	.auth()
	.store()
	.find(filter, function(error, user) {
		if(error) {
			controller.trigger('auth-resource-error', 
				'An error occured while authenticating request');
			return;
		}

		if(user.length == 0) {
			controller.trigger('auth-resource-error', 'Invalid Username or Password');
			return;
		}

		if(user[0].auth !== undefined && user[0].auth.token !== undefined &&
		   user[0].auth.token !== token) {
			controller.trigger('auth-resource-error', 'Invalid Username or Password');
			return;
		}

		controller.trigger('auth-resource-success');
		return;
	});
};