module.exports = function(controller, id) {
	//remove
	controller.{SLUG}().store().restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{SLUG}-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{SLUG}-restore-success', row);
	});
};