module.exports = function(controller, query) {
	//create the model and save
	controller
		.categorypost()
		.store()
		.model(query)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('categorypost-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('categorypost-create-success');
		});
};