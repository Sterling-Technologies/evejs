module.exports = function(controller, id) {
	//remove
	controller
		.{TEMPORARY}()
		.store()
		.remove(id, function(error, row) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{TEMPORARY}-remove-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{TEMPORARY}-remove-success', row);
		});
};