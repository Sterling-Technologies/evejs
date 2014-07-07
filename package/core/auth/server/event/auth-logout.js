module.exports = function(controller, query) {
	// Update Filter
	var filter = { 'auth.active' : false };
	
	// Set token inactive
	controller
		.auth()
		.store()
		.update(query.id, filter, function(error, user) {
			if(error) {
				return controller.trigger('auth-logout-error', error);
			}

			return controller.trigger('auth-logout-success');
		});
};