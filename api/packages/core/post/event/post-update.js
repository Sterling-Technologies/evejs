module.exports = function(controller, id, query) {
	//find and update
	controller
	.post()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('post-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('post-update-success');
	});
};