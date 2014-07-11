module.exports = function(controller, query) {
	//create the model and save
	controller.categorypost().store().insert(query, function(error, response) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('categorypost-create-error', error);
			return;
		}

		//trigger that we are good
		controller.trigger('categorypost-create-success', response);
	});
};