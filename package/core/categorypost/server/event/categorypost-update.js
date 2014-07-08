module.exports = function(controller, id, query) {
	//find and update
	controller
	.categorypost()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('categorypost-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('categorypost-update-success');

	});
};