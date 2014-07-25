module.exports = function(controller, collection, query) {
	controller
		.category()
		.store()
		.join(collection)
		.upsert(query, function(error) {
			if(error) {
				return controller.trigger('category-join-error', error);
			}

			return controller.trigger('category-join-success');
		});
}; 