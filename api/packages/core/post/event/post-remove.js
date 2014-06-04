module.exports = function(controller, id) {
	//remove
	controller
	.post()
	.store()
	.remove(id, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.server.trigger('post-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.server.trigger('post-remove-success');
	});
};