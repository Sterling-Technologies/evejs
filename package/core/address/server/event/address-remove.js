module.exports = function(controller, id) {
	//remove
	controller
	.address()
	.store()
	.remove(id, function(error, row) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('address-remove-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('address-remove-success', row);
	});
};