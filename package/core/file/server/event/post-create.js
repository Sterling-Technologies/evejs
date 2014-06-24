module.exports = function(controller, query) {
	//create the model and save
	controller
		.file()
		.store()
		.model(query)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('file-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('file-create-success');
		});
};