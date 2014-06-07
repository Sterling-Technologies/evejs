module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate(id, { $set: { active : true } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-restore-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-restore-comment-success');
		});
};