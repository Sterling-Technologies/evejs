module.exports = function(controller, id) {
	//remove
	controller
	.category()
	.store()
	.remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('category-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('category-remove-success', row);
	});
};