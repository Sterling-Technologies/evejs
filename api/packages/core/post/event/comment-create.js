module.exports = function(controller, id, query) {
	//find and update
	controller
		.user()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate(id, { $push: { comment: query } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.server.trigger('user-add-address-error', error);
				return;
			}
			
			//trigger that we are good
			controller.server.trigger('user-add-address-success');
		});
};