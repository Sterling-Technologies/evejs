module.exports = function(controller, id) {
	//remove
	controller.{{name}}().store().restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{name}}-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{name}}-restore-success', row);
	});
};