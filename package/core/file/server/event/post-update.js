module.exports = function(controller, id, query) {
	//find and update
	controller
	.file()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('file-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('file-update-success');
	});
};