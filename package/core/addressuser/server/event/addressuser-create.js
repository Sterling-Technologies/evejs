module.exports = function(controller, query) {
	//create the model and save
	controller.addressuser().store().insert(query, function(error, response) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('addressuser-create-error', error);
			return;
		}

		//trigger that we are good
		controller.trigger('addressuser-create-success', response);
	});
};