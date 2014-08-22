module.exports = function(controller, query) {
	//create the model and save
	controller.{{name}}().store().insert(query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{name}}-create-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{name}}-create-success');
	});
};