module.exports = function(controller, id) {
	//remove
	controller
	.post()
	.store()
	.restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('post-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('post-restore-success', row);
	});
};