module.exports = function(controller, id) {
	//remove
	controller
	.user()
	.store()
	.remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('user-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('user-remove-success', row);
	});
};