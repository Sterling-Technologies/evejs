module.exports = function(controller, query) {
	//create the model and save
	controller.post().store().insert(query, function(error, response) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('post-create-error', error);
			return;
		}

		//trigger that we are good
		controller.trigger('post-create-success', response);
	});
};