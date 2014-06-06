module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate({ _id : id, 'comments._id': id  }, { $set: { active: false } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-remove-comment-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-remove-comment-success');
		});
};