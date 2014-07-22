module.exports = function(controller, collection, query) {
	controller
		.address()
		.store()
		.join(collection)
		.insert(query, function(error) {
			if(error) {
				return controller.trigger('address-join-error', error);
			}

			return controller.trigger('address-join-success');
		});
};