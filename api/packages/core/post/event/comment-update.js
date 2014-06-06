module.exports = function(controller, id, comment_id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate({ _id : id, 'comments._id': comment_id,  }, { $set: { comments: query } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-comment-update-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-comment-update-success');
		});
};