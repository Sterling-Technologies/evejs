module.exports = function(controller, id, source) {
	//find and update
	controller
		.user()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate(id, { $push: { photo: source } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('user-add-photo-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('user-add-photo-success');
		});
};