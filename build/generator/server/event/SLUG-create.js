module.exports = function(controller, query) {
	//create the model and save
	controller.{SLUG}().store().insert(query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{SLUG}-create-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{SLUG}-create-success');
	});
};