module.exports = function(controller, id, query) {
	//find and update
	controller
	.user()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('user-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('user-update-success');
	});
};