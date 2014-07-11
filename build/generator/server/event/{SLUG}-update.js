module.exports = function(controller, id, query) {
	//find and update
	controller.{SLUG}().store().update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('{SLUG}-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('{SLUG}-update-success');
	});
};