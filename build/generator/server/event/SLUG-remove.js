module.exports = function(controller, id) {
	//remove
	controller.{SLUG}().store().remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{SLUG}-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{SLUG}-remove-success', row);
	});
};