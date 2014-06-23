module.exports = function(controller, id) {
	//remove
	controller
	.post()
	.store()
	.remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('post-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('post-remove-success', row);
	});
};