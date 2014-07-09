module.exports = function(controller, id, query) {
	//find and update
	controller
	.category()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('category-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('category-update-success');
	});
};