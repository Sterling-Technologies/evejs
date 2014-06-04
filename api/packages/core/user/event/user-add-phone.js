module.exports = function(controller, id, query) {
	//find and update
	controller
		.user()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate(id, { $push: { phone: query } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.server.trigger('user-add-phone-error', error);
				return;
			}
			
			//trigger that we are good
			controller.server.trigger('user-add-phone-success');
		});
};