module.exports = function(controller, id) {
	//remove
	controller.{{name}}().store().remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{name}}-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{name}}-remove-success', row);
	});
};