module.exports = function(controller, query) {
	//create the model and save
	controller.{{slug}}().store().insert(query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{slug}}-create-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{slug}}-create-success');
	});
};