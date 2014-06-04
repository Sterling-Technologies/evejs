module.exports = function(controller, id) {
	//remove
	controller
	.post()
	.store()
	.restore(id, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.server.trigger('post-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.server.trigger('post-restore-success');
	});
};