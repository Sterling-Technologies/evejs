module.exports = function(controller, id) {
	// restore
	controller.category().store().restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('category-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('category-restore-success', row);
	});
};