module.exports = function(controller, id) {
	//remove
	controller
		.{TEMPORARY}()
		.store()
		.restore(id, function(error, row) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{TEMPORARY}-restore-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{TEMPORARY}-restore-success', row);
		});
};