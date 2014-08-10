module.exports = function(controller, id) {
	//remove
	controller.{{slug}}().store().restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{{slug}}-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{{slug}}-restore-success', row);
	});
};