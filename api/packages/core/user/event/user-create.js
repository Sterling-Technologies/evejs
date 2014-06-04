module.exports = function(controller, query) {
	//create the model and save
	controller
		.user()
		.store()
		.model(query)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.server.trigger('user-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.server.trigger('user-create-success');
		});
};