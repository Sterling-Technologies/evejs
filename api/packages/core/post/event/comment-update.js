module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate(id, { $set: { comment: query } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-update-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-update-comment-success');
		});
};