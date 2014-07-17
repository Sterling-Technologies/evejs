module.exports = function(controller, query) {
	//create the model and save
	controller
		.address()
		.store()
		.model(query)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('address-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('address-create-success');
		});
};