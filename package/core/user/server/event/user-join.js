module.exports = function(controller, collection, query) {
	controller
		.user()
		.store()
		.join(collection)
		.upsert(query, function(error) {
			if(error) {
				return controller.trigger('user-join-error', error);
			}

			return controller.trigger('user-join-success');
		});
}; 