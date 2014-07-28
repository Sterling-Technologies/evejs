module.exports = function(controller, query) {
	//create the model and save
	controller.address().store().insert(query, function(error, results) {
		if(error) {
			return controller.trigger('address-create-error', error);
		}

		return controller.trigger('address-create-success', results);
	});
};