module.exports = function(controller, id, query) {
	//find and update
	controller
		.{TEMPORARY}()
		.store()
		.update(id, query, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('{TEMPORARY}-update-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('{TEMPORARY}-update-success');
		});
};