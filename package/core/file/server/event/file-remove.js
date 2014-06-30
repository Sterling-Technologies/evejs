module.exports = function(controller, id) {
	//remove
	controller
	.file()
	.store()
	.remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('file-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('file-remove-success', row);
	});
};