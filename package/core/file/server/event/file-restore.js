module.exports = function(controller, id) {
	//remove
	controller
	.file()
	.store()
	.restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('file-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('file-restore-success', row);
	});
};