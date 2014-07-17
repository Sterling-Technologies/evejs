module.exports = function(controller, query) {
	//create the model and save
	controller.postuser().store().insert(query, function(error, response) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('postuser-create-error', error);
			return;
		}

		//trigger that we are good
		controller.trigger('postuser-create-success', response);
	});
};