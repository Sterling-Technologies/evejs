module.exports = function(controller, id, query) {
	//find and update
	controller
	.address()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('address-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('address-update-success');
	});
};