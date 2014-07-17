module.exports = function(controller, id) {
	//remove
	controller
	.address()
	.store()
	.restore(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('address-restore-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('address-restore-success', row);
	});
};