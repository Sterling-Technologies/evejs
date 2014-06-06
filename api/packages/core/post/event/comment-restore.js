module.exports = function(controller, id, query) {
	//find and update
	controller
		.post()
		.store()
		.store
		//first find the id
		.findByIdAndUpdate({ 'comments._id': id }, { $set: { 'comments.$.active' : true } }, function(error) {
			//if there are errors
			if(error) {
				//trigger an error
				controller.trigger('post-comment-restore-error', error);
				return;
			}
			
			//trigger that we are good
			controller.trigger('post-comment-restore-success');
		});
};