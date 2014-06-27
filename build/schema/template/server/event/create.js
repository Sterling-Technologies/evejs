module.exports = function(controller, query) {
	//create the model and save
	controller
		.{TEMPORARY}()
		.store()
		.model(query)
		.save(function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{TEMPORARY}-create-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{TEMPORARY}-create-success');
		});
};