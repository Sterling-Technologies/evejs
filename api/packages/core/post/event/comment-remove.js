module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate({ 'comments._id': id  }, { $set: { 'comments.$.active' : false } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-comment-remove-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-comment-remove-success');
		});
};