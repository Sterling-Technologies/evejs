module.exports = function(controller, id, query) {
	//find and update
	controller
	.addressuser()
	.store()
	.update(id, query, function(error) {
		//if there are errors
		if(error) {
			//trigger an error
			controller.trigger('addressuser-update-error', error);
			return;
		}
		
		//trigger that we are good
		controller.trigger('addressuser-update-success');

	});
};