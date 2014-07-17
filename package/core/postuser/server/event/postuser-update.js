module.exports = function(controller, id, query) {
	//find and update
	controller
	.postuser()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('postuser-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('postuser-update-success');

	});
};