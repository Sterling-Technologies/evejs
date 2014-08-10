module.exports = function(controller, id) {
	//remove
	controller.{{slug}}().store().remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{slug}}-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{slug}}-remove-success', row);
	});
};