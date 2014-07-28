module.exports = function(controller, collection, query) {
	controller
		.post()
		.store()
		.join(collection)
		.upsert(query, function(error) {
			if(error) {
				return controller.trigger('post-join-error', error);
			}

			return controller.trigger('post-join-success');
		});
}; 